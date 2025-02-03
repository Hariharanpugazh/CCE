import { useState } from "react";
import { AppPages } from "../../utils/constants";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import StudentPageSearchBar from "../../components/Students/StudentPageSearchBar";
import PageHeader from "../../components/Common/StudentPageHeader";

export default function JobDashboard() {
    const [filter, setFilter] = useState("All")

    return <div className="flex flex-col">
        <StudentPageNavbar />
        <PageHeader page={AppPages.jobDashboard} filter={filter} setFilter={setFilter} />

        {/* containerized elements */}
        <div className="w-[80%] self-center">
            <StudentPageSearchBar />
        </div>
    </div>
}