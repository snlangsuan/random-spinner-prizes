import type { IVerifyUserResponse, IVerifyUserRequestBody, IGameLoggerRequestBody, IGameLoggerResponse } from '~/types/api'

export const useApi = () => {
  const verifyUser = async (link: string, gameId: number) => {
    const body: IVerifyUserRequestBody = {
      link,
      game_id: gameId,
    }
    const result = await $fetch<IVerifyUserResponse>(
      'https://townhall.peepshare.me/api/v1/user/event/game/check/play',
      {
        method: 'POST',
        body,
      }
    )
    return result
  }

  const addGameLogger = async (empId: number, gameId: number, reward: string) => {
    const body: IGameLoggerRequestBody = {
      emp_id: empId,
      game_id: gameId,
      reward,
    }
    const result = await $fetch<IGameLoggerResponse>(
      'https://townhall.peepshare.me/api/v1/user/event/game/reward/save',
      {
        method: 'POST',
        body,
      }
    )
    return result
  }

  return { verifyUser, addGameLogger }
}
