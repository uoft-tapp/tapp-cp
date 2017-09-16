import React from 'react';

const DdahAppendix = props =>
    <html>
        <head>
            <title>List of Suggested Tasks and Teaching Techniques</title>
            <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        </head>

        <body>
            <h1>List of Suggested Tasks and Teaching Techniques</h1>
            <p>
                This list is instructive only. It is not exhaustive nor, of course, will all duties
                listed here apply to all Departments or all types of positions. The list of teaching
                techniques aligns with the four categories of tutorials and is meant to offer
                information that may help instructors identify appropriate tutorial training for
                TAs.
            </p>

            <table cellSpacing="0">
                <tbody>
                    <tr className="header">
                        <td colSpan="2">Peparation</td>
                        <td colSpan="2">Contact Time</td>
                    </tr>

                    <tr>
                        <td>
                            <ul>
                                <li>Preparing course outline</li>
                                <li>Preparing handouts</li>
                                <li>Preparing bibliographies</li>
                                <li>Preparing tutorial/lecture notes</li>
                                <li>Preparing/setting up laboratory materials</li>
                                <li>Preparing/setting up audiovisual materials</li>
                                <li>Attending supervisor&apos;s lectures/seminars</li>
                                <li>Reading texts/manuals/source materials</li>
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li>Selecting relevant texts</li>
                                <li>Preparing reading lists</li>
                                <li>Preparing assignments/problem sets</li>
                                <li>Attending supervisor&apos;s labs/tutorials</li>
                                <li>Designing &amp; preparing tests/examinations</li>
                                <li>COnsulting/meeting with course supervisor</li>
                                <li>Announcing special seminars/workshops</li>
                                <li>Developing/maintaining course web site</li>
                            </ul>
                        </td>

                        <td style={{ borderLeft: '1px solid black' }}>
                            <ul>
                                <li>Leading field trips</li>
                                <li>Demonstrating problem solvung</li>
                                <li>Demonstrating in language lab</li>
                                <li>Demonstrating equipment outside of class</li>
                                <li>Conducting tutorials/seminars/practicals</li>
                                <li>Office hours</li>
                            </ul>
                        </td>

                        <td>
                            <ul>
                                <li>Demonstrating in laboratory</li>
                                <li>Tutoring individuals (not in centre)</li>
                                <li>Consulting outside of office hours</li>
                                <li>Conducting special seminars/workshops</li>
                                <li>Consulting with students electronically</li>
                                <li>Conducting lectures</li>
                            </ul>
                        </td>
                    </tr>

                    <tr className="header">
                        <td colSpan="2">Marking/Grading</td>
                        <td colSpan="2">Other Duties</td>
                    </tr>

                    <tr>
                        <td>
                            <ul>
                                <li>Book reviews</li>
                                <li>Oral presentations</li>
                                <li>Examinations</li>
                                <li>Projects</li>
                                <li>Mid-terms</li>
                                <li>End-of-term tests</li>
                                <li>Laboratory reports</li>
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li>Demonstrations</li>
                                <li>Language tapes</li>
                                <li>Data sheets</li>
                                <li>Checking lab books</li>
                                <li>Computer programs</li>
                                <li>Quizzes</li>
                                <li>Essays</li>
                            </ul>
                        </td>

                        <td colSpan="2" style={{ textAlign: 'center' }}>
                            <ul>
                                <li>Clerical (photocopying handouts/readings, etc.)</li>
                                <li>Coordinating other TAs, Resource Centres, etc.</li>
                                <li>Technical Support</li>
                                <li>Meetings with other TAs</li>
                                <li>Exam/test invigilation</li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table cellSpacing="0">
                <tbody>
                    <tr>
                        <td>
                            <b>Teaching Techniques</b>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <b>General</b>
                            <ul>
                                <li>Providing effective feedback</li>
                                <li>Tutorial planning</li>
                                <li>
                                    Classroom management (including strategies for different sizes
                                    of tutorials)
                                </li>
                                <li>Presentation skills</li>
                                <li>Respond to students&apos; questions effectively</li>
                                <li>
                                    Adapting teaching techniques (how to scale learning activities
                                    for the number of students)
                                </li>
                            </ul>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <b>Discussion-Based</b>
                            <ul>
                                <li>
                                    Effective facilitation of small, large and/or online group
                                    discussions
                                </li>
                                <li>
                                    Development of relevant examples/scenarios/questions for
                                    discussion activities
                                </li>
                                <li>
                                    Selection and use of materials and examples appropriate to
                                    discipline/course content
                                </li>
                            </ul>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <b>Skill Development</b>
                            <ul>
                                <li>
                                    Facilitating hands-on activities for different sizes of
                                    tutorials
                                </li>
                                <li>Monitoring practive-based learning</li>
                            </ul>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <b>Laboratory/Practical</b>
                            <ul>
                                <li>
                                    Effective demonstrations and presentations in a lab or practical
                                </li>
                                <li>Effective pre-lab talks</li>
                                <li>Effective monitoring of students&apos; work</li>
                            </ul>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <b>Review and Q&amp;A</b>
                            <ul>
                                <li>
                                    Consolidating and clarifying students&apos; areas of concern
                                </li>
                                <li>Modeling effective review strategies for students</li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </body>
    </html>;

const stylesheet = `
body { width: 1250px; }
h1 { text-align: center; }
p { font-weight: bold; }
p, table { width: 100%; }
table { background-color: #e7e7e7; margin-top: 1vh; border: 1px solid black; }
td { vertical-align: top; padding: 5px; }
td + td { border-left: 1px solid black; }
.header { background-color: #d5d5d5; text-align: center; font-size: large; font-weight: bold; }
ul { list-style: none; padding: 0; margin: 5px; }
table + table tr:first-child { background-color: #f9f9f9; text-align: center; font-size: x-large; }
tr + tr td { border-top: 1px solid black; }
`;

export { DdahAppendix };
