<template>
  <div id="chart">
    <div class="chart__front" />
    <div id="result" />
  </div>
</template>

<script lang="ts" setup>
import * as d3 from 'd3'
import type { PropType } from 'vue'
import type { PrizeData } from '~/types/wheel.spinner'

const props = defineProps({
  data: {
    type: Array as PropType<Array<PrizeData>>,
    required: true,
  },
})

const emit = defineEmits(['end', 'start'])

const spins: number = 3
const degrees: number = spins * 360

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

  const svg = d3.select('#chart').append('svg:svg').data([props.data]).attr('width', orgWidth).attr('height', orgHeight)
  const container = svg
    .append('svg:g')
    .attr('transform', `translate(${width / 2 + padding.left},${height / 2 + padding.top})`)

  wheel = container.append('g:g').attr('class', 'wheel')
  const pie = d3
    .pie()
    .sort(null)
    .value(() => 1)
  const arc = d3.arc().innerRadius(0).outerRadius(radius)
  const arcs = wheel.selectAll('g.slice').data(pie).enter().append('svg:g').attr('class', 'slice')
  arcs
    .append('svg:path')
    .attr('fill', (d, i) => props.data[i].bgColor ?? '#ffffff')
    .attr('d', (d) => arc(d))

  arcs
    .append('text')
    .attr('transform', (d) => {
      d.innerRadius = 0
      d.outerRadius = radius
      d.angle = (d.startAngle + d.endAngle) / 2
      return `rotate(${(d.angle * 180) / Math.PI - 90})translate(${d.outerRadius - 10})`
    })
    .attr('text-anchor', 'end')
    .text((d, i) => props.data[i].label)
    .style('font-size', fontSize)

  svg
    .append('g')
    .attr('class', 'arrow')
    .attr('transform', `translate(${(width + padding.left + padding.right) / 2 - 15}, 12)`)
    .append('path')
    .attr('d', `M0 0 H30 L 15 ${(Math.sqrt(3) / 2) * 30}Z`)
    .style('fill', '#000809')
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

function spin(id: number) {
  if (counter === 0) emit('start')
  counter++
  const piedegree = 360 / props.data.length
  const randomAssetIndex = props.data.findIndex((item) => item.value === id)
  const randomPieMovement = getRandomInt(1, piedegree)

  rotation = (props.data.length - randomAssetIndex) * piedegree - randomPieMovement + degrees

  console.log(rotation)

  wheel!
    .transition()
    .duration(3000)
    .attrTween('transform', rotTween)
    .ease(d3.easeCircleOut)
    .on('end', function () {
      emit('end')
    })
}

onMounted(() => {
  render()
})

defineExpose({ spin })
</script>

<style lang="scss" scoped>
#chart {
  display: inline-block;
  width: 500px;
  height: 500px;
  position: relative;
}

.chart__front {
  position: absolute;
  top: 0;
  left: 0;
  width: 500px;
  height: 500px;
  background-color: #ffffff;
  border: 2px solid #888888;
  border-radius: 50%;
  z-index: -1;
}

#result {
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
}
</style>
