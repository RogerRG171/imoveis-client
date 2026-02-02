"use client"

import {
  CircleAlert,
  CircleCheckBig,
  CircleDashed,
  Download,
  File,
  Hospital,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import ApplicationCard from "@/components/ApplicationCard"
import Header from "@/components/Header"
import Loading from "@/components/Loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useGetApplicationsQuery,
  useGetAuthUserQuery,
  useUpdateApplicationStatusMutation,
} from "@/state/api"

const Application = () => {
  const { data: authUser } = useGetAuthUserQuery()
  const [activateTab, setActivateTab] = useState("all")

  const {
    data: applications,
    isLoading,
    isError,
  } = useGetApplicationsQuery(
    {
      userId: authUser?.cognitoInfo.userId,
      userType: "manager",
    },
    {
      skip: !authUser?.cognitoInfo.userId,
    },
  )

  const [updateAppplicationStatus] = useUpdateApplicationStatusMutation()

  const handleStatusChange = async (id: number, status: string) => {
    await updateAppplicationStatus({ id, status })
  }

  if (isLoading) return <Loading />
  if (isError || !applications) return <div>Error fetching applications</div>

  const filteredApplications = applications?.filter((application) => {
    if (activateTab === "all") return true
    return application.status.toLowerCase() === activateTab
  })

  return (
    <div className="pt-8 px-0 sm:px-0 md:px-8 lg:px-[10%]">
      <Header
        title="Applications"
        subtitle="View and manage applications for your properties"
      />
      <Tabs
        value={activateTab}
        onValueChange={setActivateTab}
        className="w-full my-5"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="denied">Denied</TabsTrigger>
        </TabsList>
        {["all", "pending", "approved", "denied"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-5 w-full">
            {filteredApplications
              .filter(
                (application) =>
                  tab === "all" || application.status.toLowerCase() === tab,
              )
              .map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  userType="manager"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-5 w-full pb-4 px-4">
                    {/* Colored Section Status */}
                    <div
                      className={`p-4 rounded-md  grow md:max-w-[50%] ${
                        application.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : application.status === "Denied"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <div className="flex flex-wrap items-center">
                        <File className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span className="mr-2">
                          Application submitted on{" "}
                          {new Date(
                            application.applicationDate,
                          ).toLocaleDateString()}
                          .
                        </span>
                        {application.status === "Approved" && (
                          <CircleCheckBig className="w-5 h-5 mr-2 flex-shrink-0" />
                        )}
                        {application.status === "Denied" && (
                          <CircleAlert className="w-5 h-5 mr-2 flex-shrink-0" />
                        )}
                        {application.status === "Pending" && (
                          <CircleDashed className="w-5 h-5 mr-2 flex-shrink-0" />
                        )}
                        <span
                          className={`font-semibold ${
                            application.status === "Approved"
                              ? "text-green-800"
                              : application.status === "Denied"
                                ? "text-red-800"
                                : "text-yellow-800"
                          }`}
                        >
                          {application.status === "Approved" &&
                            "This application has been approved."}
                          {application.status === "Denied" &&
                            "This application has been denied."}
                          {application.status === "Pending" &&
                            "This application is pending."}
                        </span>
                      </div>
                    </div>

                    {/* Right Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/managers/properties/${application.property.id}`}
                        className={`bg-white border border-gray-300 text-gray-700 py-2 px-4
                    rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50`}
                        scroll={false}
                      >
                        <Hospital className="w-5 h-5 mr-2" />
                        Property Details
                      </Link>
                      {application.status === "Approved" && (
                        <button
                          type="button"
                          className={`bg-white border border-gray-300 text-gray-700 py-2 px-4
                            rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50`}
                        >
                          <Download className="h-5 w-5 mr-2" />
                          Download Agreement
                        </button>
                      )}
                      {application.status === "Pending" && (
                        <>
                          <button
                            className="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-500"
                            type="button"
                            onClick={() =>
                              handleStatusChange(application.id, "Approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-500"
                            type="button"
                            onClick={() =>
                              handleStatusChange(application.id, "Denied")
                            }
                          >
                            Deny
                          </button>
                        </>
                      )}
                      {application.status === "Denied" && (
                        <button
                          className={`bg-gray-800 text-white py-2 px-4 rounded-md flex items-center
                            justify-center hover:bg-secondary-500 hover:text-primary-50`}
                          type="button"
                        >
                          Contact User
                        </button>
                      )}
                    </div>
                  </div>
                </ApplicationCard>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default Application
