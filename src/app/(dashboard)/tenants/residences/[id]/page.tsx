"use client"

import {
  ArrowDownToLine,
  Check,
  CreditCard,
  Download,
  Edit,
  FileText,
  Mail,
  MapPin,
  User,
} from "lucide-react"
import { useParams } from "next/navigation"
import Loading from "@/components/Loading"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useGetAuthUserQuery,
  useGetLeasesQuery,
  useGetPaymentsQuery,
  useGetPropertyQuery,
} from "@/state/api"
import type { Lease, Payment, Property } from "@/types/prismaTypes"

const Residence = () => {
  const { id } = useParams()
  const { data: authUser } = useGetAuthUserQuery()
  const {
    data: property,
    isLoading: isPropertyLoading,
    error: propertyError,
  } = useGetPropertyQuery(Number(id))

  const { data: leases, isLoading: isLeasesLoading } = useGetLeasesQuery(
    parseInt(authUser?.cognitoInfo.userId || "0", 10),
    { skip: !authUser?.cognitoInfo.userId },
  )

  const { data: payments, isLoading: isPaymentsLoading } = useGetPaymentsQuery(
    leases?.[0]?.id || 0,
    { skip: !leases?.[0]?.id },
  )
  if (isPropertyLoading || isLeasesLoading || isPaymentsLoading)
    return <Loading />
  if (!property || propertyError) return <div>Error loading property</div>

  const currentLease = leases?.find((lease) => lease.propertyId === property.id)

  return (
    <div className="pt-8 pb-5 px-2 md:px-8 lg:px-[10%] scrollbar-hide overflow-hidden">
      <div className="w-full mx-0 md:mx-auto">
        <div className="flex-col lg:flex-row flex gap-10">
          {currentLease && (
            <ResidenceCard property={property} currentLease={currentLease} />
          )}
          <PaymentMethod />
        </div>
        <BillingHistory payments={payments || []} />
      </div>
    </div>
  )
}

const ResidenceCard = ({
  property,
  currentLease,
}: {
  property: Property
  currentLease: Lease
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 flex-1 flex flex-col justify-between max-w-[412px] md:max-w-screen-lg">
      {/* Header */}
      <div className="flex gap-5">
        <div className="w-64 h-32 object-cover bg-slate-500 rounded-xl"></div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="bg-green-500 w-fit text-white px-4 py-1 rounded-full text-sm font-semibold">
              Active Leases
            </div>

            <h2 className="text-2xl font-bold my-2">{property.name}</h2>
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 mr-1" />
              <span>
                {property.location.city}, {property.location.country}
              </span>
            </div>
          </div>
          <div className="text-xl font-bold">
            ${currentLease.rent}{" "}
            <span className="text-gray-500 text-sm font-normal">/ month</span>
          </div>
        </div>
      </div>
      {/* Dates */}
      <div>
        <hr className="my-4" />
        <div className="flex justify-between items-center">
          <div className="xl:flex">
            <div className="text-gray-500 mr-2">Start Date: </div>
            <div className="font-semibold">
              {new Date(currentLease.startdate).toLocaleDateString()}
            </div>
          </div>
          <div className="border-[0.5px] border-primary-300 h-4" />
          <div className="xl:flex">
            <div className="text-gray-500 mr-2">End Date: </div>
            <div className="font-semibold">
              {new Date(currentLease.endDate).toLocaleDateString()}
            </div>
          </div>
        </div>
        <hr className="my-4" />
      </div>
      {/* Buttons */}
      <div className="flex justify-between gap-2 w-full">
        <button
          className="bg-white border border-gray-300 text-gray-700 py-2 px-4 flex grow items-center justify-center hover:bg-primary-700 hover:text-primary-50"
          type="button"
        >
          <User className="w-5 h-5 mr-2" />
          Manager
        </button>
        <button
          className="bg-white border border-gray-300 text-gray-700 py-2 px-4 flex grow items-center justify-center hover:bg-primary-700 hover:text-primary-50"
          type="button"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Agreement
        </button>
      </div>
    </div>
  )
}

const PaymentMethod = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mt-10 md:mt-0 max-w-[412px] md:max-w-screen-lg flex-1">
      <h2 className="text-2xl font-bold mb-4">Payment method</h2>
      <p className="mb-4">Change how you pay for your plan.</p>
      <div className="border rounded-lg p-6">
        <div>
          {/* Card Info */}
          <div className="flex gap-10">
            <div className="w-36 h-20 bg-blue-600 flex items-center justify-center rounded-md">
              <span className="text-white text-2xl font-bold">VISA</span>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-5">
                  <h3 className="text-lg font-semibold">Visa ending in 2026</h3>
                  <span className="text-sm font-medium border border-primary-700 text-primary-700 px-3 py-1 rounded-full">
                    Default
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <CreditCard className="w-4 h-4 mr-1" />
                  <span>Expiry • 26/06/2026</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                <span>billing@baseclub.com</span>
              </div>
            </div>
          </div>

          <hr className="my-4" />
          <div className="flex justify-end mb-2">
            <button
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-gray-50"
              type="button"
            >
              <Edit className="w-5 h-5 mr-2" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const BillingHistory = ({ payments }: { payments: Payment[] }) => {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden p-6 flex flex-col max-w-[412px] md:max-w-full flex-1">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-1">Billing History</h2>
          <p className="text-sm text-gray-500">
            Download your previous plan <br className="block md:hidden" />{" "}
            receipts and usage details.
          </p>
        </div>
        <div>
          <button
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50"
            type="button"
          >
            <Download className="w-5 h-5 mr-2" />
            <span>Download All</span>
          </button>
        </div>
      </div>
      <hr className="mt-4 mb-1" />
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead className="pl-4">Status</TableHead>
              <TableHead>Billing Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="h-16">
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 hidden md:block" />
                    Invoice #{payment.id} - <br className="block md:hidden" />
                    {new Date(payment.paymentDate).toLocaleString("default", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-semibold border ${
                      payment.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-red-100 text-red-800 border-red-300"
                    }`}
                  >
                    {payment.paymentStatus === "Paid" ? (
                      <Check className="w-4 h-4 inline-block mr-1" />
                    ) : null}
                    {payment.paymentStatus}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{payment.amountPaid.toFixed(2)}</TableCell>
                <TableCell>
                  <button
                    className="border border-gray-300 text-gray-700 py-2 px-1 md:px-4 rounded-md flex items-center justify-center font-semibold hover:bg-primary-700 hover:text-primary-50"
                    type="button"
                  >
                    <ArrowDownToLine className="w-4 h-4 mr-1" />
                    Download
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Residence
