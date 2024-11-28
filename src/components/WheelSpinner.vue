<template>
  <div :id="uid" class="wheel-spinner__container">
    <div class="wheel-spinner__border" />
    <div class="wheel-spinner__base" />
  </div>
</template>

<script lang="ts" setup>
import * as d3 from 'd3'
import type { PrizeData } from '~/types/wheel.spinner'

const props = defineProps({
  data: {
    type: Array as PropType<Array<PrizeData>>,
    required: true,
  },
  spins: {
    type: Number,
    default: 20,
  },
  duration: {
    type: Number,
    default: 11000,
  },
  mute: {
    type: Boolean,
    default: false,
  },
  playing: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['end', 'start', 'update:loading', 'update:playing'])

const uid = ref<string>(`wheel-${getCurrentInstance()!.uid}`)
const isPlaying = ref<boolean>(false)

let player: HTMLAudioElement | undefined = undefined
const degrees: number = props.spins * 360

let wheel: d3.Selection<d3.BaseType, PrizeData[], HTMLElement, unknown> | undefined = undefined
let rotation: number = 0
let counter: number = 0

function render() {
  const padding = { top: 20, right: 20, bottom: 20, left: 20 }
  const orgWidth = 500
  const orgHeight = 500
  const width = orgWidth - padding.left - padding.right
  const height = orgHeight - padding.top - padding.bottom
  const radius = Math.min(width, height) / 2

  const fontSize = '18px'

  const svg = d3
    .select(`#${uid.value}`)
    .append('svg:svg')
    .data([props.data])
    .attr('width', orgWidth)
    .attr('height', orgHeight)
    .attr('class', 'wheel-spinner__playground')
  const container = svg
    .append('svg:g')
    .attr('transform', `translate(${width / 2 + padding.left},${height / 2 + padding.top})`)

  wheel = container.append('g:g').attr('class', 'wheel')
  const pie = d3
    .pie<PrizeData>()
    .sort(null)
    .value(() => 1)
  const arc = d3.arc<d3.PieArcDatum<PrizeData>>().innerRadius(0).outerRadius(radius)
  const arcs = wheel.selectAll('g.slice').data(pie).enter().append('svg:g').attr('class', 'slice')
  arcs
    .append('svg:path')
    .attr('fill', (d) => d.data.bg_color ?? '#ffffff')
    .attr('d', (d) => arc(d))

  arcs
    .append('text')
    .attr('transform', (d) => {
      const angle = (d.startAngle + d.endAngle) / 2
      return `rotate(${(angle * 180) / Math.PI - 90})translate(${radius - 10})`
    })
    .attr('text-anchor', 'end')
    .text((d) => d.data.label)
    .style('font-size', fontSize)

  svg
    .append('g')
    .attr('class', 'arrow')
    .attr('transform', `translate(${(width + padding.left + padding.right) / 2 - 15}, 12)`)
    .append('path')
    .attr('d', `M0 0 H30 L 15 ${(Math.sqrt(3) / 2) * 30}Z`)
    .style('fill', '#000809')
}

function loadSound() {
  emit('update:loading', true)
  player = new Audio('/sounds/spinning-eff.mp3')
  player.preload = 'auto'
}

function startSound() {
  if (!player || props.mute) return
  console.log('play sound')
  player.currentTime = 0
  player.play()
}

function stopSound() {
  if (!player || props.mute) return
  console.log('stop sound')
  player.pause()
  player.currentTime = 0
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

function rotTween() {
  const i = d3.interpolate(0, rotation)
  return (t: number) => `rotate(${i(t)})`
}

function spin(id: number | string) {
  if (isPlaying.value) return
  if (counter === 0) {
    emit('start')
    isPlaying.value = true
    emit('update:playing', isPlaying.value)
    startSound()
  }
  counter++
  const piedegree = 360 / props.data.length
  const randomAssetIndex = props.data.findIndex((item) => item.value === id)
  const randomPieMovement = getRandomInt(1, piedegree)

  rotation = (props.data.length - randomAssetIndex) * piedegree - randomPieMovement + degrees

  console.log(rotation)

  wheel!
    .transition()
    .duration(props.duration)
    .attrTween('transform', rotTween)
    .ease(d3.easeCircleOut)
    .on('end', function () {
      counter = 0
      stopSound()
      emit('end')
      isPlaying.value = false
      emit('update:playing', isPlaying.value)
    })
}

onMounted(() => {
  render()
  loadSound()
})

defineExpose({ spin })
</script>

<style lang="scss" scoped>
.wheel-spinner {
  &__container {
    display: block;
    width: 500px;
    height: 500px;
    position: relative;
    overflow: hidden;
    user-select: none;
  }

  &__border {
    position: absolute;
    top: 0;
    left: 0;
    width: 500px;
    height: 500px;
    background-color: #ffffff;
    border: 2px solid #888888;
    border-radius: 50%;
  }

  &__base {
    position: absolute;
    top: 40%;
    left: 40%;
    text-align: center;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    z-index: 1;
  }

  &__container :deep(.wheel-spinner__playground) {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
