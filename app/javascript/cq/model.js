// Store and interface with the application's data
import { action, thunk, select } from "easy-peasy";

// Compute the mode of an array, but ignore `null`
function computeMode(arr) {
    return arr.reduce(
        function(current, item) {
            // skip over `null` and `undefined`
            if (item == null) {
                return current;
            }
            const val = (current.numMapping[item] =
                (current.numMapping[item] || 0) + 1);
            if (val > current.greatestFreq) {
                current.greatestFreq = val;
                current.mode = item;
            }
            return current;
        },
        { mode: null, greatestFreq: -Infinity, numMapping: {} }
    ).mode;
}

const GET_INIT = {
    headers: {
        Accept: "application/json"
    },
    method: "GET",
    credentials: "include" // This line is crucial in any fetch because it is needed to work with Shibboleth in production
};

const POST_INIT = {
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    },
    method: "POST",
    credentials: "include" // This line is crucial in any fetch because it is needed to work with Shibboleth in production
};

export default {
    ui: {},
    data: {
        activeSession: null,
        applicants: [],
        offers: [],
        positions: [],
        sessions: [],
        messages: [],
        fetchData: thunk(async (actions, payload) => {
            const { url, attr } = payload;
            const response = await fetch(url, GET_INIT);
            const data = await response.json();
            actions.setData({ attr, data });
            actions.pushMessage({
                success: true,
                errors: false,
                message: [`Fetched ${data.length} ${attr}`]
            });
            console.log(data, payload);
        }),
        setData: action((state, payload) => {
            const { attr, data } = payload;
            if (state[attr] === undefined) {
                throw new Error(`Unknown data[attr] for attr="${attr}"`);
            }
            state[attr] = data;
        }),
        pushMessage: action((state, payload) => {
            state.messages.push(payload);
        }),
        setActiveSession: thunk(
            async (actions, payload, { dispatch, getState }) => {
                actions.setData({ data: payload, attr: "activeSession" });
                console.log("pp", payload);
                const sessionId = payload.id;

                await dispatch.data.fetchData({
                    url: `/applicants`,
                    attr: "applicants"
                });
                await dispatch.data.fetchData({
                    url: `/sessions/${sessionId}/positions`,
                    attr: "positions"
                });
                await dispatch.data.fetchData({
                    url: `/sessions/${sessionId}/offers`,
                    attr: "offers"
                });
            }
        ),
        addApplicant: thunk(
            async (actions, payload, { dispatch, getState }) => {
                const data = getState();
                const sessionId = data.activeSession.id;
                const url = `/applicants/add_or_update`;
                const json = {
                    applicants: Array.isArray(payload) ? payload : [payload]
                };
                const response = await fetch(url, {
                    ...POST_INIT,
                    body: JSON.stringify(json)
                });
                const responseJSON = await response.json();

                actions.pushMessage(responseJSON);
                console.log("updated applicants", responseJSON);

                // re-sync the current applicants
                await dispatch.data.fetchData({
                    url: `/applicants`,
                    attr: "applicants"
                });
            }
        ),
        addPosition: thunk(async (actions, payload, { dispatch, getState }) => {
            const data = getState();
            const sessionId = data.activeSession.id;
            const url = `/sessions/${sessionId}/positions/add_or_update`;
            const json = {
                positions: Array.isArray(payload) ? payload : [payload]
            };

            const response = await fetch(url, {
                ...POST_INIT,
                body: JSON.stringify(json)
            });
            const responseJSON = await response.json();

            actions.pushMessage(responseJSON);
            console.log("updated positions", responseJSON);

            // re-sync the current offers
            await dispatch.data.fetchData({
                url: `/sessions/${sessionId}/positions`,
                attr: "positions"
            });
        }),
        addOffers: thunk(async (actions, payload, { dispatch, getState }) => {
            const data = getState();
            const session = data.activeSession;
            const sessionId = data.activeSession.id;
            const url = `/sessions/${sessionId}/offers/add_or_update`;
            const json = { offers: [] };
            // every offer object needs to look like
            // {
            //     "course_id": "MAT135H1F",
            //     "round_id": "100",
            //     "utorid": "jklfs",
            //     "hours": 54,
            //     "session": "Spring",
            //     "year": 2019
            // }
            const { position, applicants, hours } = payload;
            for (const applicant of applicants) {
                json.offers.push({
                    course_id: position.position,
                    round_id: 20205,
                    utorid: applicant.utorid,
                    hours: hours,
                    session: session.semester,
                    year: session.year
                });
            }

            const response = await fetch(url, {
                ...POST_INIT,
                body: JSON.stringify(json)
            });
            const responseJSON = await response.json();

            actions.pushMessage(responseJSON);
            console.log("updated offers", responseJSON);

            // re-sync the current offers
            await dispatch.data.fetchData({
                url: `/sessions/${sessionId}/offers`,
                attr: "offers"
            });
        }),
        getApplicantsAlreadyHaveOffer: select(state => {
            return payload => {
                const { applicants = [] } = payload;
                try {
                    var position = state.getPosition(payload.position);
                } catch (e) {
                    return [];
                }
                return state.offers.filter(offer => {
                    return (
                        offer.position === position.position &&
                        applicants.some(
                            applicant =>
                                applicant.utorid === offer.applicant.utorid
                        )
                    );
                });
            };
        }),
        // Lookup a position based on the position id or position name.
        getPosition: select(state => {
            return payload => {
                const REQUIRED_ATTRS = ["id", "position"];
                if (REQUIRED_ATTRS.every(x => payload[x] == null)) {
                    throw new Error(
                        `position must have at least one of ${REQUIRED_ATTRS}`
                    );
                }
                // Get the matching position by finding the position
                // where every attribute of `payload` matches
                const position = state.positions.filter(x =>
                    Object.entries(payload).every(([key, val]) => x[key] == val)
                )[0];
                if (!position) {
                    throw new Error(
                        `Cannot find position corresponding to ${JSON.stringify(
                            payload
                        )}`
                    );
                }
                return position;
            };
        }),
        // Get the default number of hours for the position
        // specified in `payload`.
        // If the position has no hours attribute, the mode
        // of all applicants assigned to the position is used.
        getPositionDefaultHours: select(state => {
            return payload => {
                const position = state.getPosition(payload);
                if (position.hours) {
                    return position.hours;
                }
                // If the `hours` attribute is unset, find the mode of those assigned to the position.
                // Ignore any rejected offers when computing the mode.
                return computeMode(
                    state.offers.map(offer => {
                        if (
                            offer.status !== "Rejected" &&
                            offer.position == position.position
                        ) {
                            return offer.hours;
                        }
                        return null;
                    })
                );
            };
        })
    },
    initialise: thunk(async (actions, payload, { dispatch, getState }) => {
        console.log("Initializing...");
        await dispatch.data.fetchData({ url: "/sessions", attr: "sessions" });
        // set our active session so we can use it later on
        let state = getState();
        if (state.data.activeSession == null) {
            actions.data.setData({
                attr: "activeSession",
                data: state.data.sessions[0]
            });
        }
        state = getState();
        const sessionId = state.data.activeSession.id;

        await dispatch.data.fetchData({
            url: `/applicants`,
            attr: "applicants"
        });
        await dispatch.data.fetchData({
            url: `/sessions/${sessionId}/positions`,
            attr: "positions"
        });
        await dispatch.data.fetchData({
            url: `/sessions/${sessionId}/offers`,
            attr: "offers"
        });

        console.log("Initialized");
    })
};
