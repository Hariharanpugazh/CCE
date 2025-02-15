import React, { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { InputField, SelectField, TextAreaField } from "../../components/Common/InputField";

import spinGear from '../../assets/icons/spin-gear.svg'

const JobPostContext = createContext()

function SideBar() {

  const { sections, setSections } = useContext(JobPostContext)

  return <div className="flex flex-col justify-center p-4 bg-gray-100 min-h-screen w-1/4s space-y-10">
    {/* heading */}
    <div className="flex flex-col">
      <p className="text-xl"> Add a new Job </p>
      <p> Please fill in the required data</p>
    </div>

    <div className="flex flex-col space-y-6 relative">
      {
        Object.entries(sections).map(([sect, value], key) => <div key={key} className="flex space-x-2 items-center text-sm ">
          <span className="rounded-full w-4 h-4 bg-black flex items-center justify-center"> {value.selected && <span className="rounded-full w-2 h-2 bg-white">  </span>} </span>
          <p className="cursor-pointer hover:scale-[1.02]" onClick={() => {
            setSections(prevSections => ({
              ...Object.fromEntries(
                Object.keys(prevSections).map(section => [section, { selected: section === sect }])
              )
            }));
          }}> {sect} </p>
        </div>)
      }
    </div>
  </div>
}

function ContentBox() {
  const { formData, setFormData } = useContext(JobPostContext);
  const [step, setStep] = useState(0);

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep", "Delhi", "Puducherry", "Jammu and Kashmir", "Ladakh"
  ];

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));


  const OverView = () => {
    return <div className="border border-gray-400 rounded-xl flex flex-col mt-6">
      <div className="p-3 py-2 border-b border-b-gray-400 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p> Overview </p>
        </div>


        <FaCaretRight className="cursor-pointer" onClick={nextStep}/>
      </div>
      <div className="p-3 flex flex-col space-y-3">
        {
          // till industry type
          Object.keys(formData.Job_Overview).slice(0, -6).map((field, key) =>
            <InputField value={formData.Job_Overview[field]} args={{ placeHolder: field.replace("_", " ") }} label={field.replace("_", " ")} setter={
              (val) => setFormData(prevForm => ({ ...prevForm, Job_Overview: { ...prevForm.Job_Overview, [field]: val } }))
            } />)
        }
        <div className="flex space-x-3">
          <InputField value={formData.Company_Name} label={"Company Name"} args={{ placeHolder: "Company Name" }} setter={
            (val) => setFormData(prevForm => ({ ...prevForm, Job_Overview: { ...prevForm.Job_Overview, Company_Name: val } }))
          } />
          <InputField value={formData.Company_Website} label={"Company Website"} args={{ placeHolder: "Company Website" }} setter={
            (val) => setFormData(prevForm => ({ ...prevForm, Job_Overview: { ...prevForm.Job_Overview, Company_Website: val } }))
          } />
        </div>
        <SelectField value={formData.Work_Location} label={"Work Location"} args={{ placeHolder: "Work Location" }} setter={
          (val) => setFormData(prevForm => ({ ...prevForm, Job_Overview: { ...prevForm.Job_Overview, Work_Location: val } }))
        } options={states} />
        <InputField value={formData.Salary_Range} label={"Salary Range"} args={{ placeHolder: "Salary Range" }} setter={
          (val) => setFormData(prevForm => ({ ...prevForm, Job_Overview: { ...prevForm.Job_Overview, Salary_Range: val } }))
        } />
        <SelectField value={formData.Employment_Type} options={['Offline', 'Online', "Hybrid"]} label={"Employment Type"} args={{ placeHolder: "Employment Type" }} setter={
          (val) => setFormData(prevForm => ({ ...prevForm, Job_Overview: { ...prevForm.Job_Overview, Employment_Type: val } }))
        } />

        <button className="rounded-lg bg-yellow-400 p-2 mt-2" onClick={nextStep}> Next </button>
      </div>
    </div>
  }

  const JobRequirements = () => {
    return (
      <div className="border border-gray-400 rounded-xl flex flex-col mt-6">
        <div className="p-3 py-2 border-b border-b-gray-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaCaretLeft className="cursor-pointer" onClick={prevStep}/>
            <p> Job Requirements </p>
          </div>
          <FaCaretRight className="cursor-pointer" onClick={nextStep}/>
        </div>

        <div className="p-3 flex flex-col space-y-3">
          <TextAreaField
            value={formData.Job_Requirements.Roles_Responsibilities.join("\n")}
            label="Roles & Responsibilities"
            setter={(val) =>
              setFormData((prevForm) => ({
                ...prevForm,
                Job_Requirements: {
                  ...prevForm.Job_Requirements,
                  Roles_Responsibilities: val.split("\n"),
                },
              }))
            }
          />
          <InputField
            value={formData.Job_Requirements.Educational_Qualification}
            label="Educational Qualification"
            setter={(val) =>
              setFormData((prevForm) => ({
                ...prevForm,
                Job_Requirements: {
                  ...prevForm.Job_Requirements,
                  Educational_Qualification: val,
                },
              }))
            }
          />
          <InputField
            value={formData.Job_Requirements.Minimum_Marks_Requirement}
            label="Minimum Marks Requirement"
            setter={(val) =>
              setFormData((prevForm) => ({
                ...prevForm,
                Job_Requirements: {
                  ...prevForm.Job_Requirements,
                  Minimum_Marks_Requirement: val,
                },
              }))
            }
          />
          <InputField
            value={formData.Job_Requirements.Work_Experience_Requirement}
            label="Work Experience Requirement"
            setter={(val) =>
              setFormData((prevForm) => ({
                ...prevForm,
                Job_Requirements: {
                  ...prevForm.Job_Requirements,
                  Work_Experience_Requirement: val,
                },
              }))
            }
          />
          <InputField
            value={formData.Job_Requirements.Technical_Skills_Required}
            label="Technical Skills Required"
            setter={(val) =>
              setFormData((prevForm) => ({
                ...prevForm,
                Job_Requirements: {
                  ...prevForm.Job_Requirements,
                  Technical_Skills_Required: val,
                },
              }))
            }
          />
          <button className="rounded-lg bg-yellow-400 p-2 mt-2" onClick={nextStep}>
            Next
          </button>
        </div>
      </div>
    );
  };

  const ApplicationProcessTimeline = () => {
    return (
      <div className="border border-gray-400 rounded-xl flex flex-col mt-6">
        <div className="p-3 py-2 border-b border-b-gray-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaCaretLeft className="cursor-pointer" onClick={prevStep} />
            <p> Application Process & Timeline </p>
          </div>
          <FaCaretRight className="cursor-pointer" onClick={nextStep} />
        </div>

        <div className="p-3 flex flex-col space-y-3">
          <InputField
            value={formData.Application_Process_Timeline.Job_Posting_Date}
            label="Job Posting Date"
            setter={(val) =>
              setFormData((prevForm) => ({
                ...prevForm,
                Application_Process_Timeline: {
                  ...prevForm.Application_Process_Timeline,
                  Job_Posting_Date: val,
                },
              }))
            }
            args={{ type: "date" }}
          />
          <InputField
            value={formData.Application_Process_Timeline.Application_Deadline}
            label="Application Deadline"
            setter={(val) =>
              setFormData((prevForm) => ({
                ...prevForm,
                Application_Process_Timeline: {
                  ...prevForm.Application_Process_Timeline,
                  Application_Deadline: val,
                },
              }))
            }
            args={{ type: "date" }}
          />
          <TextAreaField
            value={formData.Application_Process_Timeline.Steps_to_Apply.join("\n")}
            label="Steps to Apply"
            setter={(val) =>
              setFormData((prevForm) => ({
                ...prevForm,
                Application_Process_Timeline: {
                  ...prevForm.Application_Process_Timeline,
                  Steps_to_Apply: val.split("\n"),
                },
              }))
            }
          />
          <button className="rounded-lg bg-yellow-400 p-2 mt-2" onClick={nextStep}>
            Next
          </button>
        </div>
      </div>
    );
  };

  const SelectionProcessInsights = () => {
    return (
      <div className="border border-gray-400 rounded-xl flex flex-col mt-6">
        <div className="p-3 py-2 border-b border-b-gray-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaCaretLeft className="cursor-pointer" onClick={prevStep}/>
            <p> Selection Process & Employee Insights </p>
          </div>
        </div>

        <div className="p-3 flex flex-col space-y-3">
          <TextAreaField
            value={formData.Selection_Interview_Employee_Insights.Selection_Process}
            label="Selection Process"
            setter={(val) =>
              setFormData((prevForm) => ({
                ...prevForm,
                Selection_Interview_Employee_Insights: {
                  ...prevForm.Selection_Interview_Employee_Insights,
                  Selection_Process: val,
                },
              }))
            }
          />
          <button className="rounded-lg bg-green-500 p-2 mt-2"> Submit </button>
        </div>
      </div>
    );
  };



  return (
    <div className="w-[80%] p-3 flex flex-col">
      <div>
        <p className="text-3xl leading-none"> New Job </p>
        <p> Fill in the job details </p>
      </div>

      {step === 0 && <OverView />}
      {step === 1 && <JobRequirements />}
      {step === 2 && <ApplicationProcessTimeline />}
      {step === 3 && <SelectionProcessInsights />}
    </div>
  );
}

export default function JobPostForm() {
  const [sections, setSections] = useState({
    'Job Overview & Requirements': {
      selected: true
    },
    'Application Process & Timeline': {
      selected: false,
    },
    'Job Location, Documents & Required Skills': {
      selected: false
    }
  })

  const [formData, setFormData] = useState({
    "Job_Overview": {
      "Job_Title": "",
      "Job_Description": "",
      "Industry_Type": "",
      "Company_Name": "",
      "Company_Website": "",
      "Work_Location": "",
      "Salary_Range": "",
      "Job_Level": "",
      "Employment_Type": "",
    },
    "Job_Requirements": {
      "Roles_Responsibilities": [

      ],
      "Educational_Qualification": "",
      "Minimum_Marks_Requirement": "",
      "Work_Experience_Requirement": "",
      "Professional_Certifications": [],
      "Technical_Skills_Required": [
      ],
      "Soft_Skills_Required": [
      ],
      "Age_Limit": ""
    },
    "Application_Process_Timeline": {
      "Job_Posting_Date": "",
      "Application_Deadline": "",
      "Interview_Dates": {
        "Interview_Start_Date": "",
        "Interview_End_Date": ""
      },
      "Expected_Joining_Date": "",
      "Steps_to_Apply": [
      ]
    },
    "Job_Location_Documents_Required_Skills": {
      "Office_Locations": [],
      "Remote_Work_Availability": "",
      "Relocation_Assistance": "",
      "Documents_Required": [
      ],
      "Additional_Skills": []
    },
    "Selection_Interview_Employee_Insights": {
      "Selection_Process": "",
      "Job_Preparation_Tips": "",
      "Types_of_Interview_Rounds": [
      ],
      "Work_Schedule_Office_Timings": "",
      "Glassdoor_LinkedIn_Indeed_Reviews": [
      ]
    },
    "userId": "1234567890",
    "role": "admin"
  })

  return (
    <JobPostContext.Provider value={{ sections, setSections, formData, setFormData }}>
      <div className="flex">
        <SideBar />
        <div className="flex-1 flex justify-center py-10">
          <ContentBox />
        </div>
      </div>
    </JobPostContext.Provider>
  )
}
