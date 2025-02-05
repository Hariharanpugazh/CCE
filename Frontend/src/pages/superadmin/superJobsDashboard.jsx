import { useState } from "react";
import { AppPages } from "../../utils/constants";
import PageHeader from "../../components/Common/StudentPageHeader";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

export default function SuperJobsDashboard() {
    const [filter, setFilter] = useState("All")

    return <div className="flex flex-col">
        <SuperAdminPageNavbar />
        <PageHeader page={AppPages.jobDashboard} filter={filter} setFilter={setFilter} />
    </div>
}