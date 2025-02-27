import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import Cookies from "js-cookie";

export default function Message() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            const token = Cookies.get("jwt");
            if (!token) {
                console.error("No token found. Please log in.");
                return;
            }
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/get_all_student_chats/", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudents(response.data.chats || []); // Fixed incorrect data mapping
            } catch (err) {
                console.error("Error fetching students:", err);
                setStudents([]);
            }
        };
        fetchStudents();
    }, []);

    const fetchMessages = async (student_id) => {
        setSelectedStudent(student_id);
        const token = Cookies.get("jwt");
        if (!token) {
            console.error("No token found. Please log in.");
            return;
        }
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/get_student_messages/${student_id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data.messages || []);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendReply = async () => {
        if (!selectedStudent || newMessage.trim() === "") {
            console.error("No student selected or empty message.");
            return;
        }
        
        const token = Cookies.get("jwt");
        if (!token) {
            console.error("No token found. Please log in.");
            return;
        }
        
        const replyData = {
            student_id: selectedStudent,
            content: newMessage,
        };

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/admin_reply_message/", replyData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                setNewMessage("");
                fetchMessages(selectedStudent);
            }
        } catch (error) {
            console.error("Error sending reply:", error);
        }
    };

    return (
        <div className="flex h-screen">
            <SuperAdminPageNavbar />
            <div className="w-1/4 bg-white border-r p-4">
                <h2 className="text-xl font-bold">Inbox</h2>
                <input
                    type="text"
                    placeholder="Search Inbox"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full p-2 border rounded mt-2"
                />
                <div className="mt-4">
                    {students.length > 0 ? (
                        students.filter(s => s.student_email.toLowerCase().includes(filter.toLowerCase())).map(student => (
                            <div key={student.student_id} className="p-3 border-b cursor-pointer hover:bg-gray-200" onClick={() => fetchMessages(student.student_id)}>
                                {student.student_email}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No students found</p>
                    )}
                </div>
            </div>

            <div className="w-3/4 flex flex-col h-full">
                {selectedStudent ? (
                    <>
                        <div className="p-4 bg-gray-100 border-b flex justify-between">
                            <h2 className="\text-lg font-bold ml-2\">Chat with {selectedStudent && students.find(student => student.student_id === selectedStudent)?.student_email}</h2>
                        </div>
                        <div className="flex-1 p-4 overflow-auto">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"} mb-2`}>
                                    <div className={`p-3 rounded-lg ${msg.sender === "admin" ? "bg-yellow-400 text-white" : "bg-gray-200"}`}>
                                        <p>{msg.content}</p>
                                        <small className="block text-xs mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t flex">
                            <input
                                type="text"
                                placeholder="Write message"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 p-2 border rounded"
                            />
                            <button onClick={sendReply} className="ml-2 px-4 py-2 bg-yellow-400 text-white rounded">Send</button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center flex-1 text-gray-500">
                        Select a student to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}
