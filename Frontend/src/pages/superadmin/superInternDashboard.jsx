import { useState } from "react";
import { AppPages } from "../../utils/constants";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

export default function SuperInternShipDashboard() {
    const [filter, setFilter] = useState("All")

    return <div className="flex flex-col">
        <SuperAdminPageNavbar />
        <PageHeader page={AppPages.internShipDashboard} filter={filter} setFilter={setFilter} />
    </div>
}