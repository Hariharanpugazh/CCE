import { useState } from "react";
import StudentPageHeader from "../../components/Students/StudentPageHeader";
import { AppPages } from "../../utils/constants";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";

export default function InternShipDashboard() {
    const [filter, setFilter] = useState("All")

    return <div className="flex flex-col">
        <StudentPageNavbar />
        <StudentPageHeader page={AppPages.internShipDashboard} filter={filter} setFilter={setFilter} />
    </div>
}