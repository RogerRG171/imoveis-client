import { zodResolver } from "@hookform/resolvers/zod"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import { CustomFormField } from "@/components/FormField"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { type ApplicationFormData, applicationSchema } from "@/lib/schemas"
import { useCreateApplicationMutation, useGetAuthUserQuery } from "@/state/api"

const ApplicationModal = ({
  isOpen,
  onClose,
  propertyId,
}: ApplicationModalProps) => {
  const [createApplication] = useCreateApplicationMutation()
  const { data: authuser } = useGetAuthUserQuery()

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  })

  const onSubmit = async (data: ApplicationFormData) => {
    if (!authuser || authuser.userRole !== "tenant") {
      console.error("You mes be logged in as tenant to submit an application")
      return
    }

    await createApplication({
      ...data,
      applicationDate: new Date().toISOString(),
      status: "Pending",
      propertyId: propertyId,
      tenantCognitoId: authuser.cognitoInfo.userId,
    })

    onClose()
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader className="mb-4">
          <DialogTitle>Submit Application for this Property</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <CustomFormField
              name="name"
              label="Name"
              type="text"
              placeholder="Enter your full name"
            />
            <CustomFormField
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email address"
            />
            <CustomFormField
              name="phoneNumber"
              label="Phone Number"
              type="text"
              placeholder="Enter your phone number"
            />
            <CustomFormField
              name="message"
              label="Message"
              type="textarea"
              placeholder="Enter any additional information"
            />
            <Button type="submit" className="bg-primary-700 text-white w-full">
              Submit Application
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ApplicationModal
