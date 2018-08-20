// =============================================================================
// Mock DDAH data.
// Eventually replace this temporary data to come from API fetch of our database.

const mockDdahData = {

    ddahs_entries: [
        {
            ddah_id: 55555,
            name: "Studentlonglongname Studerson",
            utorid: "theutor8",
            required_hours: 60,
            tutorial_category: "",
            duty_allocations: {
                grading: {
                    heading: "Grading",
                    duty_id: 5,
                    items: [
                        {
                            unit_name: "Assignment Grading",
                            minutes: 560,
                            num_units: 1,
                            is_revised: false,
                            minutes_revised_latest: null
                        },
                        {
                            unit_name: "Test Grading",
                            minutes: 480,
                            num_units: 1,
                            is_revised: false,
                            minutes_revised_latest: null
                        },
                        {
                            unit_name: "Final Exam Grading",
                            minutes: 7680,
                            num_units: 1,
                            is_revised: false,
                            minutes_revised_latest: null
                        }
                    ],
                },
                preparation: {
                    heading: "Preparation",
                    duty_id: 3,
                    items: [
                        {
                            unit_name: "Prep Time for Tutorials",
                            minutes: 180,
                            num_units: 1,
                            is_revised: true,
                            minutes_revised_latest: 600
                        },
                        {
                            unit_name: "Meeting with Supervisor",
                            minutes: 240,
                            num_units: 1,
                            is_revised: false,
                            minutes_revised_latest: null
                        }
                    ]
                },
                contact: {
                    heading: "Contact Time",
                    duty_id: 4,
                    items: [
                        {
                            unit_name: "Office Hours",
                            minutes: 1320,
                            num_units: 1,
                            is_revised: true,
                            minutes_revised_latest: 900
                        }
                    ]
                },
                training: {
                    heading: "Training",
                    duty_id: 1,
                    items: []
                },
                other: {
                    heading: "Other Duties",
                    duty_id: 6,
                    items: []
                }
            }
        },
        {
            ddah_id: 66666,
            name: "Lukarkark Mrokirmed",
            utorid: "applicant66",
            required_hours: 60,
            tutorial_category: "",
            duty_allocations: {
                grading: {
                    heading: "Grading",
                    duty_id: 5,
                    items: []
                },
                preparation: {
                    heading: "Preparation",
                    duty_id: 3,
                    items: []
                },
                contact: {
                    heading: "Contact Time",
                    duty_id: 4,
                    items: []
                },
                training: {
                    heading: "Training",
                    duty_id: 1,
                    items: []
                },
                other: {
                    heading: "Other Duties",
                    duty_id: 6,
                    items: []
                }
            }
        },
        {
            ddah_id: 66666,
            name: "Crumiarc Maruraked",
            utorid: "applicant390",
            required_hours: 120,
            tutorial_category: "",
            duty_allocations: {
                grading: {
                    heading: "Grading",
                    duty_id: 5,
                    items: []
                },
                preparation: {
                    heading: "Preparation",
                    duty_id: 3,
                    items: []
                },
                contact: {
                    heading: "Contact Time",
                    duty_id: 4,
                    items: []
                },
                training: {
                    heading: "Training",
                    duty_id: 1,
                    items: []
                },
                other: {
                    heading: "Other Duties",
                    duty_id: 6,
                    items: []
                }
            }
        },
        {
            ddah_id: 77777,
            name: "Sammy Douglas Jr.",
            utorid: "applicant888",
            required_hours: 80,
            tutorial_category: "",
            duty_allocations: {
                grading: {
                    heading: "Grading",
                    duty_id: 5,
                    items: []
                },
                preparation: {
                    heading: "Preparation",
                    duty_id: 3,
                    items: []
                },
                contact: {
                    heading: "Contact Time",
                    duty_id: 4,
                    items: []
                },
                training: {
                    heading: "Training",
                    duty_id: 1,
                    items: []
                },
                other: {
                    heading: "Other Duties",
                    duty_id: 6,
                    items: []
                }
            }
        },
    ],

    course_data: {
        code: "CSC108H1Y-B",
        prof: "Profname Profferson",
        name: "Introduction To Computer Programming",
        enrollment: 0,
        enrollment_rate: 0
    },

    duty_tasks: {
        // "... Grading"
        grading: {
            heading: "Grading",
            duty_id: 5,
            items: [
                {name: "Assignment", num: 14}, {name: "Test", num: 9}, {name: "Final Exam", num: 22}, {name: "Quiz", num: 5}, {name: "Demo", num: 3}, {name: "Presentation", num: 1}, {name: "Temp A", num: 0}, {name: "Temp B", num: 0}, {name: "Temp C", num: 0}
            ]
        },
        // "Prep time for ..."
        preparation: {
            heading: "Preparation",
            duty_id: 3,
            items: [
                {name: "Tutorials", num: 3}, {name: "Meeting with Supervisor", num: 1}, {name: "Temp A", num: 0}, {name: "Temp B", num: 0}, {name: "Temp C", num: 0}, {name: "Temp D", num: 0}, {name: "Temp E", num: 0}
            ]
        },
        contact: {
            heading: "Contact Time",
            duty_id: 4,
            items: [
                {name: "Office Hours", num: 4}, {name: "Temp A", num: 0}, {name: "Temp B", num: 0}, {name: "Temp C", num: 0}, {name: "Temp D", num: 0}, {name: "Temp E", num: 0}, {name: "Temp F", num: 0}, {name: "Temp G", num: 0}
            ]
        },
        training: {
            heading: "Training",
            duty_id: 1,
            items: [
                {name: "Temp A", num: 0}, {name: "Temp B", num: 0}, {name: "Temp C", num: 0}, {name: "Temp D", num: 0}, {name: "Temp E", num: 0}, {name: "Temp F", num: 0}, {name: "Temp G", num: 0}, {name: "Temp H", num: 0}, {name: "Temp I", num: 0}
            ]
        },
        other: {
            heading: "Other Duties",
            duty_id: 6,
            items: [
                {name: "Temp A", num: 0}, {name: "Temp B", num: 0}, {name: "Temp C", num: 0}, {name: "Temp D", num: 0}, {name: "Temp E", num: 0}, {name: "Temp F", num: 0}, {name: "Temp G", num: 0}, {name: "Temp H", num: 0}, {name: "Temp I", num: 0}
            ]
        }
    },

    // DDAH form:
    // ================================================

    // done
    ta_name: "Studentlonglongname Studerson",

    // done
    training: [
        {
            name: "Requires training for scaling learning activities to size of tutorial.",
            id: "training-scaling",
            checked: false
        },
        {
            name: "Attending Health and Safety training session",
            id: "training-health",
            checked: false
        },
        {
            name: "Meeting with supervisor",
            id: "training-meeting",
            checked: true
        },
        {
            name: "Adapting Teaching Techniques (ATT) (scaling learning activities)",
            id: "training-adapting",
            checked: false
        },
    ],

    // done
    tutorial_category: [
        {
            name: "Discussion-based Tutorial",
            id: "tutorial-discussion",
            checked: false
        },
        {
            name: "Skill Development Tutorial",
            id: "tutorial-skills",
            checked: true
        },
        {
            name: "Review and Q&A Session",
            id: "tutorial-review",
            checked: false
        },
        {
            name: "Laboratory/Practical",
            id: "tutorial-lab",
            checked: false
        },
    ],


    signatures: {
        supervisor: {
            name: "Profname Profferson",
            signature_initials: "imported by TA coord. for PP",
            date: "May 03, 2018"
        },
        authority: {
            name: "Karen Reid",
            signature_initials: "KR",
            date: "May 02, 2018"
        },
        ta: {
            name: "Studentlonglongname Studerson",
            signature_initials: "SS",
            date: "May 04, 2018"
        }
    },

    mid_course_review_changes: {
        supervisor: {
            name: "",
            signature_initials: "imported by TA coord. for PP",
            date: "June 02, 2018"
        },
        authority: {
            name: "",
            signature_initials: "KR",
            date: "June 01, 2018"
        },
        ta: {
            name: "",
            signature_initials: "SS",
            date: "June 03, 2018"
        }
    }
}

export { mockDdahData };
