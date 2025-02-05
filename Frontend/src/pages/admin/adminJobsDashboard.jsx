import { useState } from "react";
import { AppPages } from "../../utils/constants";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";

export default function AdminJobsDashboard() {
    const [filter, setFilter] = useState("All")

    return <div className="flex flex-col">
        <AdminPageNavbar />
        <PageHeader page={AppPages.jobDashboard} filter={filter} setFilter={setFilter} />
    </div>
}