import { useState } from "react";
import { AppPages } from "../../utils/constants";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";

export default function AdminInternShipDashboard() {
    const [filter, setFilter] = useState("All")

    return <div className="flex flex-col">
        <StudentPageNavbar />
        <PageHeader page={AppPages.internShipDashboard} filter={filter} setFilter={setFilter} />
    </div>
}