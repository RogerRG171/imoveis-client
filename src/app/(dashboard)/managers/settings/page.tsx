"use client"

import SettingsForm from "@/components/SettingsForm"
import {
  useGetAuthUserQuery,
  useUpdateManagerSettingsMutation,
} from "@/state/api"

const Settings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery()
  const [updateManager] = useUpdateManagerSettingsMutation()

  if (isLoading) return <>Loading...</>

  const initialData = {
    name: authUser?.userInfo.name,
    email: authUser?.userInfo.email,
    phoneNumber: authUser?.userInfo.phoneNumber,
  }

  const handleSubmit = async (data: typeof initialData) => {
    await updateManager({
      cognitoId: authUser?.cognitoInfo?.userId,
      ...data,
    })
  }

  return (
    <div>
      <SettingsForm
        initialData={initialData}
        userType="manager"
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default Settings
