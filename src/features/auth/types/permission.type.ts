export interface Permission {
  Id: number
  Name: string
  Code: string
  PermissionDetails: PermissionDetail[]
}

export interface PermissionDetail {
  id: number
  name: string
  code: string
  note: string
}
