
import { useState, useRef, useEffect } from "react";

import Button from "../../generic/UserInputs/Button";

import StreakScore from "./StreakScore";
import Information from "./Information";
import Strengths from "./Strengths";
import Results from "./Results";
import MobileResults from "./MobileResults";

import {
    WindowsContainer,
    WindowsLayout,
} from "../../generic/Window";

import "./Grades.css";

export default function Grades({ grades, fetchUserGrades, activeAccount, isLoggedIn, useUserData, sortGrades, isTabletLayout }) {
    // States
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [selectedDisplayType, setSelectedDisplayType] = useState("Évaluations");

    const userData = useUserData();

    const sortedGrades = userData.get("sortedGrades");


    useEffect(() => {
        if (sortedGrades) { // We use areGradesNew to prevent the changement of selectedPeriod when we update sortedGrades in simulation  
            let currentPeriod = 0;
            for (let periodCode in sortedGrades) {
                if (Date.now() > sortedGrades[periodCode].endDate) {
                    if (currentPeriod < Object.keys(sortedGrades).length - 1) {
                        currentPeriod++;
                    }
                }
            }
            setSelectedPeriod(Object.keys(sortedGrades)[currentPeriod]);
        }
    }, [sortedGrades])
    
    // Behavior
    useEffect(() => {
        document.title = "Notes • Ecole Directe Plus";
    }, [])

    useEffect(() => {
        const controller = new AbortController();
        if (isLoggedIn) {
            if (grades.length < 1 || grades[activeAccount] === undefined) {
                fetchUserGrades(controller);
            } else {
                sortGrades(grades, activeAccount);
            }
        }

        return () => {
            // console.log("controller.abort")
            controller.abort();
        }
    }, [grades, isLoggedIn, activeAccount]);

    // JSX
    return (
        <div id="grades">
            <WindowsContainer name="grades">
                <WindowsLayout direction="row" ultimateContainer={true}>
                    <WindowsLayout direction="column">
                        {/* {console.log(sortedGrades)}
                        {console.log(sortedGrades.length > 0 && sortedGrades[activeAccount])}
                        {console.log(sortedGrades.length > 0 && sortedGrades[activeAccount] && sortedGrades[activeAccount][selectedPeriod])}
                        {console.log(sortedGrades.length > 0 && sortedGrades[activeAccount] && sortedGrades[activeAccount][selectedPeriod]?.streak)}
                        {console.log((sortedGrades.length > 0 && sortedGrades[activeAccount] && sortedGrades[activeAccount][selectedPeriod]?.streak) ?? 0)} */}
                        <StreakScore streakScore={(sortedGrades && sortedGrades[selectedPeriod]?.streak) ?? 0} streakHighScore={(sortedGrades && sortedGrades[selectedPeriod]?.maxStreak) ?? 0} />
                        <Information sortedGrades={sortedGrades} activeAccount={activeAccount} selectedPeriod={selectedPeriod} />
                        <Strengths sortedGrades={sortedGrades} activeAccount={activeAccount} selectedPeriod={selectedPeriod} />
                    </WindowsLayout>
                    <WindowsLayout growthFactor={2}>
                        {isTabletLayout
                            ? <MobileResults
                            activeAccount={activeAccount}
                            sortedGrades={sortedGrades}
                            selectedPeriod={selectedPeriod}
                            setSelectedPeriod={setSelectedPeriod}
                            selectedDisplayType={selectedDisplayType}
                            setSelectedDisplayType={setSelectedDisplayType} />
                            : <Results
                            activeAccount={activeAccount}
                            sortedGrades={sortedGrades}
                            selectedPeriod={selectedPeriod}
                            setSelectedPeriod={setSelectedPeriod}
                            selectedDisplayType={selectedDisplayType}
                            setSelectedDisplayType={setSelectedDisplayType} />
                        }
                    </WindowsLayout>
                </WindowsLayout>
            </WindowsContainer>
        </div>
    )
}
