<template>
    <div>
        <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ApexOptions } from 'apexcharts';

// Definindo as props que o componente vai receber
const props = defineProps<{
    series: { name: string; data: number[] }[];
    categories: string[];
}>();

const chartOptions = computed((): ApexOptions => ({
    chart: {
        height: 350,
        type: 'area',
        toolbar: {
            show: false, // Esconde o menu de ferramentas do gráfico
        },
        zoom: {
            enabled: false,
        },
    },
    dataLabels: {
        enabled: false, // Esconde os números em cima dos pontos
    },
    stroke: {
        curve: 'smooth', // Linhas suavizadas
        width: 2,
    },
    xaxis: {
        type: 'category',
        categories: props.categories, // Usa as categorias passadas via props
        labels: {
            style: {
                colors: '#94a3b8', // Cor dos labels do eixo X (slate-400)
            },
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: '#94a3b8', // Cor dos labels do eixo Y (slate-400)
            },
        },
    },
    grid: {
        borderColor: 'rgba(255, 255, 255, 0.1)', // Cor das linhas do grid
        strokeDashArray: 4,
    },
    tooltip: {
        theme: 'dark',
        x: {
            format: 'dd/MM',
        },
    },
    legend: {
        labels: {
            colors: '#cbd5e1', // Cor da legenda (slate-300)
        },
    },
    fill: {
        type: 'gradient',
        gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.05,
        }
    },
    colors: ['#22d3ee', '#a78bfa'], // Cores das linhas (cyan-400, violet-400)
}));
</script>