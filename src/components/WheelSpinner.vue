<template>
  <div :id="uid" class="wheel-spinner__container" :style="{ width: `${wheelWidth}px`, height: `${wheelHeight}px` }">
    <ul class="wheel-spinner-light">
      <!-- <li class="wheel-spinner-light__dot" />
      <li class="wheel-spinner-light__dot" />
      <li class="wheel-spinner-light__dot" />
      <li class="wheel-spinner-light__dot" />
      <li class="wheel-spinner-light__dot" />
      <li class="wheel-spinner-light__dot" />
      <li class="wheel-spinner-light__dot" />
      <li class="wheel-spinner-light__dot" />
      <li class="wheel-spinner-light__dot" />
      <li class="wheel-spinner-light__dot" />
      <li class="wheel-spinner-light__dot" />
      <li class="wheel-spinner-light__dot" /> -->
    </ul>
    <div class="wheel-spinner__border" />
    <div
      class="wheel-spinner__base"
      :style="{
        width: `${wheelWidth * 0.4}px`,
        height: `${wheelHeight * 0.4}px`,
        top: `${wheelHeight * 0.2}px`,
        left: `${wheelWidth * 0.3}px`,
      }"
    />
  </div>
</template>

<script lang="ts" setup>
import * as d3 from 'd3'
import type { PrizeData } from '~/types/prize.d'

const runtimeConfig = useRuntimeConfig()

const props = defineProps({
  data: {
    type: Array as PropType<Array<PrizeData>>,
    required: true,
  },
  spins: {
    type: Number,
    default: 5,
  },
  duration: {
    type: Number,
    default: 3000,
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
  first: {
    type: String,
    default: '',
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

const wheelWidth = ref<number>(700)
const wheelHeight = ref<number>(700)

function render() {
  console.log('render', props.data)
  const padding = { top: 45, right: 45, bottom: 45, left: 45 }
  // const orgWidth = 500
  // const orgHeight = 500
  const width = wheelWidth.value - padding.left - padding.right
  const height = wheelHeight.value - padding.top - padding.bottom
  const radius = Math.min(width, height) / 2

  const svg = d3
    .select(`#${uid.value}`)
    .append('svg:svg')
    .data([props.data])
    .attr('width', wheelWidth.value)
    .attr('height', wheelHeight.value)
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

  // arcs
  //   .append('text')
  //   .attr('transform', (d) => {
  //     const angle = (d.startAngle + d.endAngle) / 2
  //     return `rotate(${(angle * 180) / Math.PI - 90})translate(${radius - 10})`
  //   })
  //   .attr('text-anchor', 'end')
  //   .text((d) => d.data.label)
  //   .style('font-size', fontSize)

  let midAngle = 0
  arcs
    .append('text')
    .attr('transform', (d) => {
      midAngle = (((d.startAngle + d.endAngle) / 2) * 180) / Math.PI - 360
      const pos = arc.centroid(d)
      pos[0] = pos[0] * 1.1
      pos[1] = pos[1] * 1.1
      return `translate(${pos})rotate(${midAngle})`
    })
    .attr('dy', '0em')
    .attr('text-anchor', 'middle')
    .text((d) => d.data.label)
    .style('font-size', '14px')

  arcs
    .append('svg:image')
    .attr('class', 'image')
    .attr('xlink:href', (d) => d.data.image)
    .attr('width', 100)
    .attr('height', 100)
    .attr('x', -50)
    .attr('y', -135)
    .attr('transform', (d) => {
      midAngle = (((d.startAngle + d.endAngle) / 2) * 180) / Math.PI - 360
      return `translate(${arc.centroid(d)})rotate(${midAngle})`
    })

  wheel.attr('transform', () => {
    const piedegree = 360 / props.data.length
    const randomAssetIndex = props.data.findIndex((item) => item.id === props.first)
    const randomPieMovement = 22.5

    console.log([
      props.data.length,
      randomAssetIndex,
      piedegree,
      randomPieMovement,
      degrees,
    ])
    rotation = (props.data.length - randomAssetIndex) * piedegree - randomPieMovement + degrees
    return `rotate(${rotation})`
  })
}

function initLight(maxItems: number = 24) {
  const rx = 328
  const ry = 328
  const so = 10
  const light = document.querySelector('.wheel-spinner-light')
  // console.log(lights)
  // lights[0].style.top = '20px'
  // lights[3].style.top = '20px'
  const elements: Array<HTMLElement> = []
  for (let i = 0; i < maxItems; i++) {
    const m = document.createElement('li')
    m.classList.add('wheel-spinner-light__dot')
    // m.classList.add(i % 2 === 0 ? 'wheel-spinner-light__dot--even' : 'wheel-spinner-light__dot--odd')
    m.classList.add('wheel-spinner-light__dot--odd')
    m.style.top = `${ry + -ry * Math.cos((360 / maxItems / 180) * (i + so) * Math.PI) + 8}px`
    m.style.left = `${rx + rx * Math.sin((360 / maxItems / 180) * (i + so) * Math.PI) + 8}px`
    elements.push(m)
    light?.appendChild(m)
  }

  let count: boolean = true
  setInterval(() => {
    const target = (i: number) => (count ? i % 2 === 0 : i % 2 > 0)
    elements.forEach((item) => item && item.classList.remove('wheel-spinner-light__dot--open'))
    elements.filter((_elm, i) => target(i)).forEach((elm) => elm.classList.add('wheel-spinner-light__dot--open'))
    count = !count
  }, 200)
}

function loadSound() {
  emit('update:loading', true)
  player = new Audio(`${runtimeConfig.app.baseURL}sounds/spinning-eff.mp3`)
  player.preload = 'auto'
}

function startSound() {
  if (!player || props.mute) return
  player.currentTime = 0
  player.play()
}

function stopSound() {
  if (!player || props.mute) return
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
  const randomAssetIndex = props.data.findIndex((item) => item.id === id)
  const randomPieMovement = getRandomInt(1, piedegree)

  rotation = (props.data.length - randomAssetIndex) * piedegree - randomPieMovement + degrees

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
  initLight()
  render()
  loadSound()
})

defineExpose({ spin, render })
</script>

<style lang="scss" scoped>
.wheel-spinner {
  &__container {
    display: block;
    position: relative;
    overflow: hidden;
    user-select: none;
    border-radius: 50%;
    box-shadow: 1px 1.5px 5.5px 4.5px rgba(0, 0, 0, 0.25);
  }

  &__border {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(255, 212, 179);
    background: radial-gradient(
      circle,
      rgba(255, 212, 179, 1) 0%,
      rgba(252, 184, 142, 1) 30%,
      rgba(236, 112, 46, 1) 100%
    );
    // background-image: url('~/assets/images/bg-wheel.png');
    // border: 4px solid #000000;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  &__base {
    position: absolute;
    // top: 100px;
    // left: 150px;
    text-align: center;
    // width: 200px;
    // height: 200px;
    // border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    z-index: 1;
    background-image: url('~/assets/images/wheel-pin.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }

  &__container :deep(.wheel-spinner__playground) {
    position: absolute;
    top: 0;
    left: 0;
  }

  &-light {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    list-style: none;

    & :deep(.wheel-spinner-light__dot) {
      position: absolute;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.3);
    }

    // & :deep(.wheel-spinner-light__dot--even) {
    //   background: rgb(183, 72, 35);
    // }

    // & :deep(.wheel-spinner-light__dot--odd) {
    //   background: rgb(211, 201, 147);
    // }

    & :deep(.wheel-spinner-light__dot--even.wheel-spinner-light__dot--open) {
      background: rgba(211, 81, 36, 1);
      box-shadow:
        inset 0px 0px 10px 1px rgba(255, 255, 255, 0.35),
        0px 0px 10px rgba(255, 255, 255, 0.2);
    }

    & :deep(.wheel-spinner-light__dot--odd.wheel-spinner-light__dot--open) {
      background: rgba(253, 241, 177, 1);
      box-shadow:
        inset 0px 0px 10px 1px rgba(255, 255, 255, 0.35),
        0px 0px 10px rgba(255, 255, 255, 0.2);
      animation-duration: 0.01s;
      animation-name: opening;
    }
  }

  @keyframes opening {
    from {
      opacity: 0.1;
      background: rgba(0, 0, 0, 0.3);
    }
    to {
      opacity: 1;
      background: rgba(253, 241, 177, 1);
    }
  }
}
</style>
