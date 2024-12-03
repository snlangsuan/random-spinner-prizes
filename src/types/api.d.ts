export interface IUserInfo {
  id: string
  first_name: string
  last_name: string
  emp_code: string
  comp_group_id: number
  comp_id: number
  peep_share_id: string
  peep_share_link: string
  peep_share_name: string
  deleted: boolean
  created_at: string
  updated_at: string
  created_by?: number
  updated_by?: number
}

export interface IResultLogger {
  id: number
  emp_id: number
  game_id: number
  reward_name: string
  created_at: string
  updated_at: string
  deleted: boolean
  created_by?: number
}

export interface IVerifyUserRequestBody {
  link: string
  game_id: number
}

export interface IVerifyUserResponse {
  success: boolean
  user?: IUserInfo
  message?: string
}

export interface IGameLoggerRequestBody {
  emp_id: number
  game_id: number
  reward: string
}

export interface IGameLoggerResponse {
  success: boolean
  result: IResultLogger
}
