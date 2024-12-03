import Compressor from 'compressorjs'
import type { PrizeData } from '~/types/prize.d'

export const imageCompressor = (image: File, mimeType: string = 'image/jpeg'): Promise<File | Blob> => {
  return new Promise((resolve, reject) => {
    new Compressor(image, {
      convertSize: 2000000,
      quality: 0.6,
      mimeType,
      maxWidth: 512,
      success: resolve,
      error: reject,
    })
  })
}

export const convDataURL = (image: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(String(reader.result))
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(image)
  })
}

export const weightedRandom = (items: Array<PrizeData>): PrizeData | undefined => {
  const shuffleItems = items.map((item) => ({ ...item })).sort(() => Math.random() - 0.5)
  const weights = shuffleItems.map((item) => item.weight * 100)
  // const totalWeight = weights.reduce((sum, i) => sum + i, 0)
  // const randomNumber = Math.floor(Math.random() * totalWeight) + 1
  // let currentWeight = 0
  // for (let itemIndex = 0; itemIndex < weights.length; itemIndex++) {
  //   currentWeight += weights[itemIndex]
  //   if (randomNumber <= currentWeight) {
  //     return shuffleItems[itemIndex]
  //   }
  // }
  const cumulativeWeights: number[] = []
  for (let i = 0; i < weights.length; i += 1) {
    cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0)
  }
  const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1]
  const randomNumber = maxCumulativeWeight * Math.random()
  for (let itemIndex = 0; itemIndex < shuffleItems.length; itemIndex += 1) {
    if (cumulativeWeights[itemIndex] >= randomNumber) {
      return shuffleItems[itemIndex]
    }
  }
}
