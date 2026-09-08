<script setup lang="ts">
import { computed, ref } from 'vue'

type CustomerClass = '正常类' | '普通类' | '关注类' | '可疑类' | '优质白名单'
type ViewKey = '总览' | '客户分级' | '调额测算' | '白名单' | '跑批中心' | '报表监控'
type AuditResult = '已生效' | '已记录' | '待复核'
type Customer = {
  id: string
  name: string
  customerClass: CustomerClass
  asset: number
  debitMax: number
  salary: number
  currentLimit: number
  cycle: '半年' | '每日'
  tag: string
  status: '正常' | '待复核' | '风险关注'
  riskNote?: string
}
type Audit = {
  id: string
  time: string
  action: string
  customer: string
  before?: CustomerClass
  after?: CustomerClass
  reason: string
  operator: string
  result: AuditResult
}
type Adjustment = {
  id: string
  customer: string
  customerClass: CustomerClass
  before: number
  after: number
  time: string
  batch: string
  status: '已生效' | '回执超时' | '待复核'
}

const classOptions: CustomerClass[] = ['正常类', '普通类', '关注类', '可疑类', '优质白名单']
const views: { key: ViewKey; icon: string; note: string }[] = [
  { key: '总览', icon: '▦', note: '运行态势与快捷操作' },
  { key: '客户分级', icon: '◫', note: '多维标签与分类复核' },
  { key: '调额测算', icon: '⌁', note: '公式明细与人工复核' },
  { key: '白名单', icon: '◇', note: '优质客户准入与退出' },
  { key: '跑批中心', icon: '↻', note: '批量任务与断点补跑' },
  { key: '报表监控', icon: '▤', note: '结果追踪与异常预警' },
]

const customers = ref<Customer[]>([
  { id: 'C2026090718', name: '陈先生', customerClass: '优质白名单', asset: 648000, debitMax: 85000, salary: 32000, currentLimit: 500000, cycle: '半年', tag: '支行审批 / 资产达标', status: '正常' },
  { id: 'C2026090821', name: '李女士', customerClass: '正常类', asset: 186000, debitMax: 22000, salary: 12800, currentLimit: 200000, cycle: '半年', tag: '稳定代发 / 正常状态', status: '正常' },
  { id: 'C2026091404', name: '周女士', customerClass: '普通类', asset: 58000, debitMax: 9800, salary: 7600, currentLimit: 100000, cycle: '半年', tag: '财政直发工资', status: '正常' },
  { id: 'C2026091176', name: '王同学', customerClass: '关注类', asset: 3860, debitMax: 4200, salary: 0, currentLimit: 30000, cycle: '半年', tag: '学生 / 低资产', status: '待复核' },
  { id: 'C2026091329', name: '赵先生', customerClass: '可疑类', asset: 860, debitMax: 1200, salary: 0, currentLimit: 50000, cycle: '每日', tag: '长期静默账户', status: '风险关注', riskNote: '静默账户资产低于 5,000 元' },
  { id: 'C2026091533', name: '孙女士', customerClass: '可疑类', asset: 3280, debitMax: 7600, salary: 0, currentLimit: 60000, cycle: '每日', tag: '代发连续 3 月断发', status: '风险关注', riskNote: '近 3 月无代发入账' },
  { id: 'C2026091647', name: '刘先生', customerClass: '关注类', asset: 32000, debitMax: 11200, salary: 0, currentLimit: 50000, cycle: '半年', tag: '流动从业人员', status: '正常' },
  { id: 'C2026091751', name: '杨女士', customerClass: '普通类', asset: 42600, debitMax: 6800, salary: 6900, currentLimit: 80000, cycle: '半年', tag: '社保代发工资', status: '正常' },
])

const adjustments = ref<Adjustment[]>([
  { id: 'ADJ-0907-018', customer: '赵先生', customerClass: '可疑类', before: 50000, after: 5000, time: '2026-09-07 03:14', batch: '每日跑批', status: '已生效' },
  { id: 'ADJ-0907-029', customer: '孙女士', customerClass: '可疑类', before: 60000, after: 7600, time: '2026-09-07 03:14', batch: '每日跑批', status: '已生效' },
  { id: 'ADJ-0907-441', customer: '王同学', customerClass: '关注类', before: 30000, after: 4200, time: '2026-09-07 06:12', batch: '半年度批量', status: '待复核' },
  { id: 'ADJ-0907-583', customer: '周女士', customerClass: '普通类', before: 100000, after: 58000, time: '2026-09-07 06:12', batch: '半年度批量', status: '已生效' },
  { id: 'ADJ-0907-812', customer: '李女士', customerClass: '正常类', before: 200000, after: 186000, time: '2026-09-07 06:12', batch: '半年度批量', status: '已生效' },
  { id: 'ADJ-0907-931', customer: '陈先生', customerClass: '优质白名单', before: 500000, after: 500000, time: '2026-09-07 06:12', batch: '半年度批量', status: '回执超时' },
  { id: 'ADJ-0308-777', customer: '刘先生', customerClass: '关注类', before: 80000, after: 32000, time: '2026-03-08 05:46', batch: '半年度批量', status: '已生效' },
])

const audits = ref<Audit[]>([
  { id: 'AUD-1003', time: '2026-09-07 10:23', action: '白名单自动退出', customer: '陈**', before: '优质白名单', after: '正常类', reason: '模拟查冻扣事件', operator: '系统规则引擎', result: '已记录' },
  { id: 'AUD-1002', time: '2026-09-07 06:12', action: '半年度调额结果写入', customer: '4,862 位客户', reason: '批量任务完成', operator: '调额批处理', result: '已生效' },
  { id: 'AUD-1001', time: '2026-09-07 03:02', action: '可疑类日终跑批', customer: '1,248 位客户', reason: '每日计划任务', operator: '调额批处理', result: '已生效' },
])

const activeView = ref<ViewKey>('总览')
const selectedId = ref(customers.value[0].id)
const classFilter = ref<'全部' | CustomerClass>('全部')
const reportClassFilter = ref<'全部' | CustomerClass>('全部')
const reportTimeFilter = ref<'全部' | '本期' | '近半年'>('全部')
const reportLimitFilter = ref<'全部' | '下调' | '未变'>('全部')
const notice = ref('夜间批量任务运行正常 · 展示数据均为脱敏演示数据')
const runState = ref<'空闲' | '执行中' | '已完成'>('空闲')
const whitelistQuery = ref('')
const classificationOpen = ref(false)
const manualLimitOpen = ref(false)
const newClass = ref<CustomerClass>('正常类')
const classReason = ref('')
const classOperator = ref('客户分级分类管理人员')
const manualLimit = ref(0)

const selected = computed(() => customers.value.find(item => item.id === selectedId.value) ?? customers.value[0])
const filteredCustomers = computed(() => classFilter.value === '全部' ? customers.value : customers.value.filter(item => item.customerClass === classFilter.value))
const whitelistCustomers = computed(() => customers.value.filter(item => item.customerClass === '优质白名单' && (item.name.includes(whitelistQuery.value) || item.id.includes(whitelistQuery.value))))
const filteredAdjustments = computed(() => adjustments.value.filter(item => {
  const classOk = reportClassFilter.value === '全部' || item.customerClass === reportClassFilter.value
  const timeOk = reportTimeFilter.value === '全部' || (reportTimeFilter.value === '本期' ? item.time.startsWith('2026-09') : item.time >= '2026-03-01')
  const limitOk = reportLimitFilter.value === '全部' || (reportLimitFilter.value === '下调' ? item.after < item.before : item.after === item.before)
  return classOk && timeOk && limitOk
}))
const reportStats = computed(() => {
  const rows = filteredAdjustments.value
  return {
    count: rows.length,
    effective: rows.filter(row => row.status === '已生效').length,
    pending: rows.filter(row => row.status !== '已生效').length,
    amount: rows.reduce((total, row) => total + Math.max(0, row.before - row.after), 0),
  }
})
const classDistribution = computed(() => classOptions.map(item => ({ label: item, count: customers.value.filter(customer => customer.customerClass === item).length })))

function formatMoney(value: number) {
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(value)
}
function getCandidate(customer: Customer) {
  if (customer.customerClass === '优质白名单' || customer.customerClass === '正常类') return Math.max(customer.debitMax * 10, customer.salary * 20, customer.asset)
  if (customer.customerClass === '普通类') return Math.max(customer.debitMax * 2, customer.salary * 5, customer.asset)
  if (customer.customerClass === '可疑类') {
    if (customer.tag.includes('静默') && customer.asset < 10) return 1000
    if (customer.tag.includes('静默') && customer.asset <= 5000) return 5000
    if (customer.tag.includes('断发') && customer.asset < 5000) return customer.debitMax <= 5000 ? 5000 : customer.debitMax
    return Math.max(customer.debitMax * 2, customer.asset)
  }
  if (customer.asset <= 5000 && customer.debitMax < 5000) return Math.max(customer.debitMax, customer.asset, 1000)
  return Math.max(customer.debitMax * (customer.asset <= 50000 ? 1.5 : 2), customer.asset)
}
const calculatedLimit = computed(() => Math.min(selected.value.currentLimit, getCandidate(selected.value)))
const formula = computed(() => {
  const customer = selected.value
  if (customer.customerClass === '优质白名单' || customer.customerClass === '正常类') return 'min(原限额, max(近半年借方最大 × 10, 月均代发 × 20, 时点资产))'
  if (customer.customerClass === '普通类') return 'min(原限额, max(近半年借方最大 × 2, 月均代发 × 5, 时点资产))'
  if (customer.customerClass === '可疑类') return customer.tag.includes('静默') ? '静默账户：按时点资产区间直接定额' : '断发账户：按借方最大或关注类规则调整'
  return 'min(原限额, max(近半年借方最大 × 1 ~ 2, 时点资产))'
})

function selectCustomer(id: string, target: ViewKey = '调额测算') {
  selectedId.value = id
  activeView.value = target
}
function openClassAdjustment(customer: Customer) {
  selectedId.value = customer.id
  newClass.value = customer.customerClass
  classReason.value = ''
  classOperator.value = '客户分级分离管理人员'
  classificationOpen.value = true
}
function confirmClassAdjustment() {
  const customer = selected.value
  if (!classReason.value.trim()) {
    notice.value = '请填写人工调整原因，系统将据此生成完整审计记录。'
    return
  }
  const before = customer.customerClass
  customer.customerClass = newClass.value
  customer.cycle = newClass.value === '可疑类' ? '每日' : '半年'
  customer.status = '待复核'
  customer.tag = `人工复核：${classReason.value}`
  audits.value.unshift({
    id: `AUD-M${Date.now()}`,
    time: '2026-09-07 10:28',
    action: '人工调整客户分类',
    customer: `${customer.name} · ${customer.id}`,
    before,
    after: newClass.value,
    reason: classReason.value,
    operator: classOperator.value,
    result: '待复核',
  })
  notice.value = `${customer.name} 已由${classOperator.value}提交分类调整，待复核后生效。`
  classificationOpen.value = false
}
function openManualLimit() {
  manualLimit.value = calculatedLimit.value
  manualLimitOpen.value = true
}
function confirmManualLimit() {
  const customer = selected.value
  customer.currentLimit = manualLimit.value
  adjustments.value.unshift({ id: `ADJ-M${Date.now()}`, customer: customer.name, customerClass: customer.customerClass, before: customer.currentLimit, after: manualLimit.value, time: '2026-09-07 10:30', batch: '人工复核', status: '待复核' })
  audits.value.unshift({ id: `AUD-L${Date.now()}`, time: '2026-09-07 10:30', action: '人工调额复核', customer: `${customer.name} · ${formatMoney(manualLimit.value)} 元`, reason: '人工限额复核', operator: '客户分级分类管理人员', result: '待复核' })
  notice.value = `已提交 ${customer.name} 的人工调额复核，处理结果可在统计报表中查询。`
  manualLimitOpen.value = false
}
function exitWhitelist(customer: Customer) {
  const before = customer.customerClass
  customer.customerClass = '正常类'
  customer.tag = '已退出白名单 / 模拟止付事件'
  customer.cycle = '半年'
  customer.status = '待复核'
  audits.value.unshift({ id: `AUD-W${Date.now()}`, time: '2026-09-07 10:32', action: '白名单退出', customer: `${customer.name} · ${customer.id}`, before, after: '正常类', reason: '模拟公安止付事件', operator: '白名单监听服务', result: '已记录' })
  notice.value = `${customer.name} 已模拟退出白名单，分类已回落至正常类并留存审计记录。`
}
function runBatch() {
  runState.value = '执行中'
  notice.value = '正在模拟运行：读取资产、识别静默及断发账户、计算候选限额…'
  window.setTimeout(() => {
    runState.value = '已完成'
    audits.value.unshift({ id: `AUD-B${Date.now()}`, time: '2026-09-07 10:35', action: '手动触发可疑类跑批', customer: '1,248 位客户', reason: '运营补跑验证', operator: '客户分级分类管理人员', result: '已生效' })
    notice.value = '模拟跑批完成：已复核 1,248 位可疑类客户，3 项异常已推送待办。'
  }, 700)
}
function dispatchAlert(label: string) {
  notice.value = `已将“${label}”分派至风险运营复核队列。`
}
</script>

<template>
  <main class="app-shell">
    <aside class="sidebar">
      <div class="brand"><div>个人客户分级分类管理及动态调额系统</div></div>
      <nav><button v-for="item in views" :key="item.key" :class="['nav-item', { active: activeView === item.key }]" @click="activeView = item.key"><span class="nav-icon">{{ item.icon }}</span><span>{{ item.key }}</span></button></nav>
      <div class="side-foot"><p>v0.0.1</p></div>
    </aside>

    <section class="workspace">
      <header class="topbar">
        <div><p class="crumb">个人客户分级分类管理及动态调额系统 / {{ activeView }}</p><h1>{{ activeView }}</h1></div>
        <div class="top-actions"><button class="icon-button" aria-label="通知">⌁<b>3</b></button><span class="date-pill">2026年09月07日 · 周一</span><button class="user-management" @click="notice = '已打开客户分级分类管理人员的用户管理入口。'"><span>风</span><i><b>客户分级分类管理人员</b><small>调额复核权限</small></i><em>⌄</em></button></div>
      </header>
      <div class="notice"><span>◆</span>{{ notice }}<button @click="notice = '已确认：当前展示数据均为脱敏演示数据。'">确认</button></div>

      <div class="scroll-area">
        <template v-if="activeView === '总览'">
          <section class="hero-grid">
            <article class="page-intro"><p>限额策略运行总览</p><h2>以客户分级为锚，<br>让每一次调整可解释、可追溯。</h2><span>本期半年度批量调额已完成，核心系统回执率 99.96%。</span><button class="primary light" @click="activeView = '跑批中心'">查看执行中心 <b>→</b></button></article>
            <article class="limit-orbit"><div class="orbit-caption"><span>今日受控金额</span><strong>¥ 86,420,000</strong><small>较昨日 <b>+4.8%</b></small></div><div class="rings ring-a"></div><div class="rings ring-b"></div><div class="rings ring-c"></div><div class="node node-a">关注类<br><b>15,842</b></div><div class="node node-b">可疑类<br><b>1,248</b></div><div class="node node-c">白名单<br><b>926</b></div></article>
          </section>
          <section class="metric-grid"><article><span>本期覆盖客户</span><strong>128,640</strong><small>半年度批量 · 06:12 完成</small></article><article><span>自动调额生效</span><strong>127,918</strong><small class="positive">99.44% 核心回执成功</small></article><article class="warning"><span>待人工复核</span><strong>23</strong><small>含 3 项限额异常告警</small></article><article><span>白名单退出</span><strong>6</strong><small>止付 / 查冻扣实时监听</small></article></section>
          <section class="two-column">
            <article class="panel"><div class="panel-title"><div><span>客户分级分布</span><h3>样本分类与调额周期</h3></div><button class="text-button" @click="activeView = '客户分级'">进入分级管理 →</button></div><div class="class-rows"><div v-for="(item, index) in classDistribution" :key="item.label"><span :class="['dot', `d${index}`]"></span><b>{{ item.label }}</b><em>{{ item.count }} 个样本</em><i :style="{ width: `${Math.max(18, item.count * 12)}%` }"></i><small>{{ item.label === '可疑类' ? '每日' : '半年' }}</small></div></div></article>
            <article class="panel"><div class="panel-title"><div><span>最新审计轨迹</span><h3>关键操作留痕</h3></div><button class="text-button" @click="activeView = '报表监控'">全部记录 →</button></div><div class="audit-list"><div v-for="log in audits.slice(0, 4)" :key="log.id"><i></i><p><b>{{ log.action }}</b><span>{{ log.customer }} · {{ log.operator }}</span></p><time>{{ log.time.slice(5) }}</time></div></div></article>
          </section>
        </template>

        <template v-else-if="activeView === '客户分级'">
          <section class="section-heading"><div><p>F001 · 分级分类标识</p><h2>客户分级分类管理</h2><span>职业、资产、交易行为与代发情况自动匹配；人工复核会生成可追溯审计记录。</span></div><button class="primary" @click="openClassAdjustment(selected)">人工调整分级</button></section>
          <section class="rule-strip"><div><b>优质白名单 / 正常类</b><span>近 3 月资产 ≥ 20 万、审批或在职身份</span><em>半年</em></div><div><b>普通类</b><span>财政直发、社保代发及行政事业人员</span><em>半年</em></div><div><b>关注类 / 可疑类</b><span>低资产、学生、静默或代发断发账户</span><em class="daily">可疑类每日</em></div></section>
          <section class="panel table-panel"><div class="table-head"><div><h3>待分级与已分级客户</h3><span>脱敏演示数据 · 覆盖五类客户与风险场景</span></div><div class="segmented"><button v-for="filter in ['全部', ...classOptions] as const" :key="filter" :class="{ selected: classFilter === filter }" @click="classFilter = filter">{{ filter }}</button></div></div><div class="customer-table"><div class="tr th"><span>客户</span><span>当前分类</span><span>分类依据</span><span>时点资产</span><span>调额周期</span><span>状态</span><span>操作</span></div><div v-for="customer in filteredCustomers" :key="customer.id" class="tr"><span><b>{{ customer.name }}</b><small>{{ customer.id }}</small></span><span><i :class="['class-badge', customer.customerClass]">{{ customer.customerClass }}</i></span><span>{{ customer.tag }}</span><span>¥ {{ formatMoney(customer.asset) }}</span><span>{{ customer.cycle }}</span><span :class="['status', customer.status]">{{ customer.status }}</span><span class="row-actions"><button class="table-action" @click="selectCustomer(customer.id)">测算</button><button class="table-action" @click="openClassAdjustment(customer)">调整</button></span></div></div></section>
          <section class="panel audit-full"><div class="table-head"><div><h3>分类变更审计记录</h3><span>记录调整前后分类、原因、操作人与时间</span></div><button class="secondary" @click="notice = '已应用分类审计筛选：仅显示人工与退出事件。'">筛选记录</button></div><div class="audit-table"><div class="audit-row th"><span>时间</span><span>客户</span><span>分类变更</span><span>调整原因</span><span>操作人</span><span>状态</span></div><div v-for="log in audits.filter(item => item.before || item.action.includes('分类'))" :key="log.id" class="audit-row"><span>{{ log.time }}</span><span>{{ log.customer }}</span><span>{{ log.before ? `${log.before} → ${log.after}` : '—' }}</span><span>{{ log.reason }}</span><span>{{ log.operator }}</span><em :class="log.result">{{ log.result }}</em></div></div></section>
        </template>

        <template v-else-if="activeView === '调额测算'">
          <section class="section-heading"><div><p>F002 · 非柜面限额动态计算</p><h2>调额计算与生效明细</h2><span>候选限额与原限额取低值；已排除贷款和偶然大额借方交易。</span></div><button class="primary" @click="openManualLimit">人工调额复核</button></section>
          <section class="calculator-layout"><aside class="panel customer-picker"><div class="picker-head"><h3>客户样本</h3><span>{{ customers.length }} 位</span></div><button v-for="customer in customers" :key="customer.id" :class="['customer-option', { picked: selected.id === customer.id }]" @click="selectedId = customer.id"><span><b>{{ customer.name }}</b><small>{{ customer.id }}</small></span><i :class="['class-badge', customer.customerClass]">{{ customer.customerClass }}</i></button></aside><section class="calc-body"><div class="selected-customer"><div class="avatar">{{ selected.name.slice(0, 1) }}</div><div><p>{{ selected.id }} · {{ selected.tag }}</p><h3>{{ selected.name }} <i :class="['class-badge', selected.customerClass]">{{ selected.customerClass }}</i></h3><span>当前限额 ¥ {{ formatMoney(selected.currentLimit) }} · {{ selected.cycle }}策略生效中</span></div><div class="cycle-chip"><span>{{ selected.cycle }}跑批</span><b>{{ selected.customerClass === '可疑类' ? '每日 02:00' : '每年 3月 / 9月' }}</b></div></div><article class="formula-card"><div class="formula-label">适用调额公式</div><code>{{ formula }}</code><p>最终限额 = <b>min(原限额 ¥ {{ formatMoney(selected.currentLimit) }}, 候选限额 ¥ {{ formatMoney(getCandidate(selected)) }})</b></p></article><div class="calculation-steps"><article><span>01 / 近半年单日借方最大</span><strong>¥ {{ formatMoney(selected.debitMax) }}</strong><small>已剔除贷款及偶发大额</small></article><article><span>02 / 月均代发工资</span><strong>¥ {{ formatMoney(selected.salary) }}</strong><small>近 6 个月口径</small></article><article><span>03 / 跑批日时点资产</span><strong>¥ {{ formatMoney(selected.asset) }}</strong><small>核心系统 T+1 数据</small></article><article class="result"><span>04 / 建议日累计限额</span><strong>¥ {{ formatMoney(calculatedLimit) }}</strong><small>按客户分类策略计算</small></article></div><div class="calc-footer"><p><b>控制说明：</b>{{ selected.riskNote || '该客户适用当前分类策略，限额更新写入核心系统并生成回执。' }}</p><div><button class="secondary" @click="notice = '已生成该客户的调额计算明细单。'">导出明细</button><button class="primary" @click="notice = `已模拟写入核心：${selected.name} 日累计限额 ¥ ${formatMoney(calculatedLimit)}。`">模拟生效</button></div></div></section></section>
        </template>

        <template v-else-if="activeView === '白名单'">
          <section class="section-heading"><div><p>F003 · 优质白名单动态管理</p><h2>优质客户白名单</h2><span>审批准入、资产达标与员工身份可纳入；止付、查冻扣或连续 3 月不达标自动退出。</span></div><button class="primary" @click="notice = '已创建白名单新增申请，等待支行审批。'">发起新增申请</button></section>
          <section class="whitelist-summary"><article><span>白名单客户</span><strong>926</strong><small>本期新增 42 位</small></article><article><span>资产达标率</span><strong>98.6%</strong><small>连续 3 月资产 ≥ 20 万</small></article><article><span>自动退出事件</span><strong>6</strong><small class="danger-text">含止付 / 查冻扣 2 项</small></article></section>
          <section class="panel table-panel"><div class="table-head"><div><h3>白名单状态监控</h3><span>审批、资产与风险事件实时校验</span></div><input v-model="whitelistQuery" placeholder="搜索客户名称或编号"></div><div class="customer-table"><div class="tr wh-row th"><span>客户</span><span>准入依据</span><span>近3月资产</span><span>最近审批</span><span>风险校验</span><span>操作</span></div><div v-for="customer in whitelistCustomers" :key="customer.id" class="tr wh-row"><span><b>{{ customer.name }}</b><small>{{ customer.id }}</small></span><span>{{ customer.tag }}</span><span>¥ {{ formatMoney(customer.asset) }}</span><span>支行审批通过</span><span class="status 正常">无异常</span><button class="table-action danger" @click="exitWhitelist(customer)">模拟退出</button></div></div></section>
          <section class="exit-event"><span>⚑</span><div><b>自动退出规则正在监听</b><p>公安紧急止付 / 有权机关查冻扣实时触发；优质客户连续 3 个月资产低于 20 万立即退出。</p></div><button @click="notice = '已模拟接收止付事件：客户将退出白名单并生成审计记录。'">模拟风险事件</button></section>
        </template>

        <template v-else-if="activeView === '跑批中心'">
          <section class="section-heading"><div><p>F004 · 调额批量作业调度</p><h2>跑批中心</h2><span>正常、普通、关注类每半年运行；可疑类每日运行，支持断点续跑和补跑。</span></div><button class="primary" :disabled="runState === '执行中'" @click="runBatch">{{ runState === '执行中' ? '正在执行…' : '手动触发跑批' }}</button></section>
          <section class="batch-feature"><div class="batch-visual"><div class="progress-ring"><b>{{ runState === '已完成' ? '100' : runState === '执行中' ? '68' : '—' }}<small>%</small></b></div><span>可疑类每日调额作业</span></div><div class="batch-copy"><p>当前计划任务</p><h2>每日 02:00 · 风险客户动态限额计算</h2><div class="task-tags"><span>读取 T+1 资产</span><span>识别静默 / 断发</span><span>更新核心限额</span></div><div class="batch-info"><div><small>最近执行</small><b>09-07 03:02 完成</b></div><div><small>处理客户</small><b>1,248 位</b></div><div><small>异常待办</small><b class="danger-text">3 项</b></div></div></div></section>
          <section class="panel table-panel"><div class="table-head"><div><h3>作业执行记录</h3><span>支持按失败节点进行断点补跑</span></div><button class="secondary" @click="notice = '已生成 2026-03 半年度跑批补跑任务。'">创建补跑任务</button></div><div class="job-list"><div><span class="job-status ok">●</span><b>JOB-20260907-DAILY</b><span>可疑类每日跑批</span><span>1,248 / 1,248</span><time>03:02:15 — 03:14:08</time><em>完成</em></div><div><span class="job-status ok">●</span><b>JOB-20260907-HALF</b><span>半年度批量调额</span><span>128,640 / 128,640</span><time>01:30:42 — 06:12:24</time><em>完成</em></div><div><span class="job-status wait">●</span><b>JOB-20260308-RETRY</b><span>接口回执补跑</span><span>722 / 722</span><time>待排期</time><em>已归档</em></div></div></section>
        </template>

        <template v-else>
          <section class="section-heading"><div><p>F006 · 调额结果报表与异常监控</p><h2>统计报表与监控</h2><span>支持按客户类别、调额前后限额与调整时间筛选，汇总结果、明细和异常统一可查。</span></div><button class="primary" @click="notice = '已开始导出当前筛选条件下的调额结果报表。'">导出当前报表</button></section>
          <section class="report-filters"><label>客户类别<select v-model="reportClassFilter"><option>全部</option><option v-for="item in classOptions" :key="item">{{ item }}</option></select></label><label>调整时间<select v-model="reportTimeFilter"><option>全部</option><option>本期</option><option>近半年</option></select></label><label>限额变化<select v-model="reportLimitFilter"><option>全部</option><option>下调</option><option>未变</option></select></label><button class="secondary" @click="reportClassFilter = '全部'; reportTimeFilter = '全部'; reportLimitFilter = '全部'">重置筛选</button></section>
          <section class="report-summary"><article><span>筛选结果</span><strong>{{ reportStats.count }}</strong><small>笔调额记录</small></article><article><span>已生效</span><strong>{{ reportStats.effective }}</strong><small class="positive">核心回执成功</small></article><article><span>待处理异常</span><strong>{{ reportStats.pending }}</strong><small class="danger-text">超时 / 人工复核</small></article><article><span>累计下调</span><strong>¥ {{ formatMoney(reportStats.amount) }}</strong><small>按调额前后差额统计</small></article></section>
          <section class="report-grid"><article class="panel trend-card"><div class="panel-title"><div><span>限额调整趋势</span><h3>近 6 个批次生效金额</h3></div><b>单位：万元</b></div><div class="bars"><div v-for="(height, index) in [42, 58, 50, 72, 63, 88]" :key="index" :style="{ height: `${height}%` }"><span>{{ ['03', '04', '05', '06', '07', '09'][index] }}月</span></div></div><div class="trend-value"><b>8,642</b><span>本期生效总额 · 环比 +4.8%</span></div></article><article class="panel alert-card"><div class="panel-title"><div><span>异常监控</span><h3>需要关注的事件</h3></div><span class="alert-count">3</span></div><div class="alert-list"><div><i>!</i><p><b>限额更新回执超时</b><span>核心接口 · 2 位客户</span></p><button @click="dispatchAlert('限额更新回执超时')">分派</button></div><div><i>!</i><p><b>白名单资产连续下滑</b><span>资产校验 · 1 位客户</span></p><button @click="activeView = '白名单'">查看</button></div><div><i>!</i><p><b>人工分类待复核</b><span>分级分类 · 1 位客户</span></p><button @click="activeView = '客户分级'">复核</button></div></div></article></section>
          <section class="panel table-panel"><div class="table-head"><div><h3>调额明细报表</h3><span>共 {{ reportStats.count }} 笔 · 点击筛选条件可联动汇总统计</span></div><button class="secondary" @click="notice = '已生成调额明细导出任务。'">导出明细</button></div><div class="customer-table"><div class="report-row th"><span>调整时间</span><span>客户</span><span>客户类别</span><span>调整前限额</span><span>调整后限额</span><span>执行批次</span><span>状态</span></div><div v-for="row in filteredAdjustments" :key="row.id" class="report-row"><span>{{ row.time }}</span><span><b>{{ row.customer }}</b><small>{{ row.id }}</small></span><span><i :class="['class-badge', row.customerClass]">{{ row.customerClass }}</i></span><span>¥ {{ formatMoney(row.before) }}</span><span class="after-limit">¥ {{ formatMoney(row.after) }}</span><span>{{ row.batch }}</span><span><em :class="row.status">{{ row.status }}</em></span></div></div></section>
        </template>
      </div>
    </section>

    <div v-if="classificationOpen" class="modal-mask" @click.self="classificationOpen = false"><section class="modal"><button class="close" @click="classificationOpen = false">×</button><p>F001 · 人工调整分级分类</p><h2>{{ selected.name }} · {{ selected.id }}</h2><span>当前分类：<b>{{ selected.customerClass }}</b>。提交后进入复核队列，并同步留存调整原因、操作人与时间。</span><label>调整后分类<select v-model="newClass"><option v-for="item in classOptions" :key="item">{{ item }}</option></select></label><label>调整原因<textarea v-model="classReason" placeholder="例如：人工核验客户职业与近期代发信息后修正分类"></textarea></label><label>操作人<input v-model="classOperator"></label><div><button class="secondary" @click="classificationOpen = false">取消</button><button class="primary" @click="confirmClassAdjustment">提交复核</button></div></section></div>
    <div v-if="manualLimitOpen" class="modal-mask" @click.self="manualLimitOpen = false"><section class="modal"><button class="close" @click="manualLimitOpen = false">×</button><p>人工调额复核</p><h2>{{ selected.name }} · {{ selected.id }}</h2><span>建议限额 ¥ {{ formatMoney(calculatedLimit) }}，人工修改需进入复核队列。</span><label>拟生效日累计限额（元）<input v-model.number="manualLimit" type="number" min="0"></label><div><button class="secondary" @click="manualLimitOpen = false">取消</button><button class="primary" @click="confirmManualLimit">提交复核</button></div></section></div>
  </main>
</template>

<style scoped>
* { box-sizing: border-box; }
button, input, select, textarea { font: inherit; } button { cursor: pointer; }
.app-shell { height: 100%; min-height: 0; display: flex; overflow: hidden; background: #f4f9f5; color: var(--app-foreground); }
.sidebar { width: 232px; flex: 0 0 232px; background: #102e24; color: #d5e7dd; padding: 24px 14px 18px; display: flex; flex-direction: column; }
.brand { display: flex; align-items: center; gap: 10px; padding: 2px 10px 24px; color: white; }.brand strong { font-size: 21px; letter-spacing: .08em; }.brand small { display:block; font-size:10px; color:#8fb5a3; margin-top:2px; }.brand-mark { width:29px;height:29px;position:relative;border:1px solid #09b626; transform:rotate(45deg); border-radius:5px; }.brand-mark span { position:absolute;background:#72d59d;width:5px;border-radius:8px;bottom:5px; }.brand-mark span:nth-child(1){height:9px;left:5px}.brand-mark span:nth-child(2){height:16px;left:11px}.brand-mark span:nth-child(3){height:21px;left:17px}.environment { border:1px solid #1afd05;border-radius:7px;padding:8px 10px;font-size:11px;margin:0 6px 22px;color:#a8d5bd; }.environment i { display:inline-block;background:#52d0a1;width:6px;height:6px;border-radius:50%;margin-right:7px; }
nav { display:grid; gap:5px; }.nav-item { border:0;background:transparent;color:#9bbcac;text-align:left;padding:10px 11px;border-radius:8px;font-size:13px;display:flex;gap:11px;align-items:center; }.nav-item:hover,.nav-item.active { background:#1d513f;color:#fff; }.nav-item.active { box-shadow:inset 2px 0 #76d6a1; }.nav-icon { width:15px;text-align:center;font-size:17px;line-height:15px; }.side-foot { margin-top:auto; }.side-foot p { margin:8px 7px 0;color:#6f9d88;font-size:12px; }
.workspace { flex:1; min-width:0; display:flex; flex-direction:column; }.topbar { height:79px;flex:0 0 79px;display:flex;align-items:center;justify-content:space-between;padding:0 38px;background:white;border-bottom:1px solid var(--app-border); }.crumb,.section-heading p { margin:0 0 4px;color:var(--app-muted-foreground);font-size:11px; }.topbar h1 { margin:0;font-size:19px; }.top-actions { display:flex;align-items:center;gap:16px; }.date-pill { font-size:12px;color:#536b60; }.icon-button { position:relative;border:0;background:transparent;font-size:21px;color:#557264; }.icon-button b { position:absolute;right:-4px;top:-5px;background:#ef5963;color:white;border-radius:50%;font-size:8px;min-width:13px;height:13px;display:grid;place-items:center; }.user-management { display:flex;align-items:center;gap:8px;border:1px solid #d9e9df;background:#fbfefc;border-radius:8px;padding:5px 9px 5px 5px;text-align:left;color:#183e2e; }.user-management>span { width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#d9f2e2;color:#117044;font-size:12px;font-weight:700; }.user-management i { font-style:normal;line-height:1.12; }.user-management b,.user-management small { display:block; }.user-management b { font-size:11px; }.user-management small { font-size:9px;color:#718b7d;margin-top:3px; }.user-management em { font-style:normal;color:#789388;font-size:12px; }.notice { min-height:38px;background:#ecf8f0;border-bottom:1px solid #d8ede0;padding:9px 38px;color:#44715a;font-size:11px;display:flex;align-items:center;gap:8px; }.notice>span { color:var(--app-primary-color); }.notice button { margin-left:auto;border:0;background:transparent;color:var(--app-primary-color);font-size:11px; }.scroll-area { overflow:auto;padding:27px 38px 42px; }
.primary { border:0;background:var(--app-primary-color);color:var(--app-primary-foreground);border-radius:6px;padding:10px 14px;font-weight:650;font-size:12px;box-shadow:0 4px 10px #16845324; }.primary:disabled { opacity:.65;cursor:not-allowed; }.secondary { border:1px solid var(--app-border);background:#fff;color:#42685a;border-radius:5px;padding:7px 9px;font-size:10px; }.text-button { border:0;background:transparent;padding:0;color:var(--app-primary-color);font-size:10px; }.hero-grid { display:grid;grid-template-columns:1.12fr .88fr;min-height:208px;background:#123f2f;border-radius:13px;overflow:hidden;color:white; }.page-intro { padding:27px 31px;background:linear-gradient(115deg,#123f2f 60%,#1a6647); }.page-intro p { font-size:11px;letter-spacing:.08em;color:#a9e3c1;margin:0 0 8px; }.page-intro h2 { font-weight:650;font-size:25px;line-height:1.27;margin:0 0 9px;letter-spacing:.02em; }.page-intro>span { font-size:11px;color:#c0ddcc;display:block; }.page-intro .light { margin-top:19px;background:#edfbf2;color:#12613e; }.limit-orbit { position:relative;overflow:hidden;background:radial-gradient(circle at 48% 53%,#2a7654 0 4%,transparent 5%),linear-gradient(130deg,#185a40,#102f25); }.orbit-caption { position:absolute;z-index:2;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;white-space:nowrap; }.orbit-caption span,.orbit-caption small { display:block;font-size:10px;color:#bfe0cc; }.orbit-caption strong { display:block;font-size:19px;margin:5px 0; }.orbit-caption b { color:#7be4c5; }.rings { position:absolute;border:1px solid #86d8a155;border-radius:50%;left:50%;top:50%;transform:translate(-50%,-50%); }.ring-a{width:125px;height:125px}.ring-b{width:210px;height:210px}.ring-c{width:300px;height:300px}.node { position:absolute;background:#216044;border:1px solid #69b88d;border-radius:5px;padding:5px 8px;font-size:9px;color:#d0ecdc; }.node b{color:white}.node-a{top:21px;right:50px}.node-b{bottom:21px;left:33px}.node-c{bottom:38px;right:38px}
.metric-grid,.whitelist-summary,.report-summary { display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin:18px 0; }.metric-grid article,.whitelist-summary article,.report-summary article { background:white;border:1px solid var(--app-border);border-radius:10px;padding:15px 17px; }.metric-grid span,.whitelist-summary span,.report-summary span { display:block;color:var(--app-muted-foreground);font-size:11px; }.metric-grid strong,.whitelist-summary strong,.report-summary strong { display:block;font-size:22px;margin:7px 0 5px;letter-spacing:-.04em; }.metric-grid small,.whitelist-summary small,.report-summary small { display:block;font-size:10px;color:#718096; }.positive { color:#16826a!important; }.danger-text { color:#c65658!important; }.metric-grid .warning { border-top:2px solid #e7a440; }.two-column,.report-grid { display:grid;grid-template-columns:1.1fr .9fr;gap:17px; }.panel { background:white;border:1px solid var(--app-border);border-radius:10px; }.panel-title,.table-head { display:flex;align-items:center;justify-content:space-between;padding:17px 20px;border-bottom:1px solid #edf0f4; }.panel-title span,.table-head span { color:var(--app-muted-foreground);font-size:10px; }.panel-title h3,.table-head h3 { margin:3px 0 0;font-size:14px; }.class-rows { padding:10px 20px 15px; }.class-rows>div { display:grid;grid-template-columns:11px 100px 65px 1fr 45px;gap:7px;align-items:center;margin:10px 0;font-size:10px; }.class-rows b { font-size:11px; }.class-rows em { font-style:normal;color:#516076; }.class-rows i { height:5px;background:#dbeee2;border-radius:5px;position:relative; }.class-rows i:after { content:'';position:absolute;inset:0 auto 0 0;width:100%;background:var(--app-primary-color);border-radius:inherit; }.class-rows small { color:#718096;text-align:right; }.dot { width:7px;height:7px;border-radius:50%; }.d0{background:#7457bd}.d1{background:#28935f}.d2{background:#438d98}.d3{background:#e2a74a}.d4{background:#d86769}.audit-list { padding:4px 20px 11px; }.audit-list>div { display:grid;grid-template-columns:9px 1fr auto;align-items:center;gap:9px;padding:11px 0;border-bottom:1px solid #f0f2f6; }.audit-list>div:last-child { border:0; }.audit-list i { width:6px;height:6px;border-radius:50%;background:#3ca56f; }.audit-list p { margin:0; }.audit-list p b { display:block;font-size:11px; }.audit-list p span { display:block;margin-top:2px;color:#7a899f;font-size:10px; }.audit-list time { font-size:10px;color:#8390a4; }
.section-heading { display:flex;align-items:end;justify-content:space-between;margin-bottom:19px; }.section-heading h2 { margin:0 0 6px;font-size:23px;letter-spacing:-.03em; }.section-heading>div>span { color:#718096;font-size:11px; }.rule-strip { display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:#ddebe2;border:1px solid #ddebe2;border-radius:9px;overflow:hidden;margin-bottom:17px; }.rule-strip div { background:white;padding:13px 15px;display:grid;grid-template-columns:1fr auto;gap:5px; }.rule-strip b { font-size:11px; }.rule-strip span { grid-column:1 / span 2;color:#718096;font-size:10px; }.rule-strip em { color:#267451;font-size:10px;font-style:normal;background:#eaf8ef;border-radius:4px;padding:2px 5px; }.rule-strip em.daily { color:#b85e36;background:#fff2ea; }.segmented { display:flex;background:#f2f7f3;padding:3px;border-radius:6px; }.segmented button { border:0;background:transparent;font-size:10px;color:#66758c;padding:5px 7px;border-radius:4px; }.segmented button.selected { background:white;color:var(--app-primary-color);box-shadow:0 1px 3px #dcebe1; }.customer-table { padding:0 20px 14px;overflow:auto; }.tr,.report-row { display:grid;grid-template-columns:1.25fr 1.1fr 1.2fr .85fr .65fr .65fr .9fr;gap:9px;align-items:center;min-height:53px;border-bottom:1px solid #edf0f4;font-size:11px;color:#526178; }.tr:last-child,.report-row:last-child { border-bottom:0; }.tr>span:first-child b,.report-row b { display:block;color:#24344d;font-size:11px; }.tr small,.report-row small { display:block;color:#8a98ac;font-size:9px;margin-top:3px; }.tr.th,.report-row.th,.audit-row.th { min-height:36px;color:#8a98ac;font-size:10px; }.class-badge { display:inline-block;font-style:normal;padding:3px 6px;border-radius:4px;font-size:9px;white-space:nowrap;background:#eaf8ef;color:#207c50; }.class-badge.关注类 { background:#fff6e5;color:#b27619; }.class-badge.可疑类 { background:#fff0ef;color:#bc5353; }.class-badge.普通类 { background:#eef7f8;color:#31808b; }.class-badge.优质白名单 { background:#f1edff;color:#6a54ae; }.status { font-size:10px; }.status.正常 { color:#178064; }.status.待复核 { color:#bd7a20; }.status.风险关注 { color:#c45155; }.row-actions { display:flex;gap:5px;justify-content:end; }.table-action { border:0;background:transparent;color:var(--app-primary-color);font-size:10px; }.table-action.danger { color:#c25353; }.audit-full { margin-top:17px; }.audit-table { padding:0 20px 14px;overflow:auto; }.audit-row { display:grid;grid-template-columns:1.05fr 1fr 1.2fr 1.45fr 1fr .6fr;gap:10px;align-items:center;min-height:48px;border-bottom:1px solid #edf0f4;color:#526178;font-size:10px; }.audit-row:last-child{border:0}.audit-row em,.report-row em { font-style:normal;font-size:10px;padding:3px 6px;border-radius:4px;background:#eaf8f3;color:#18785f;justify-self:start; }.audit-row em.待复核,.report-row em.待复核 { background:#fff5e5;color:#b3751f; }.report-row em.回执超时 { background:#fff0ef;color:#bc5353; }
.calculator-layout { display:grid;grid-template-columns:215px 1fr;gap:17px; }.customer-picker { padding:10px;align-self:start; }.picker-head { display:flex;justify-content:space-between;align-items:center;padding:5px 7px 10px; }.picker-head h3 { margin:0;font-size:13px; }.picker-head span { font-size:10px;color:#8090a6; }.customer-option { border:0;background:transparent;width:100%;display:flex;justify-content:space-between;align-items:center;text-align:left;padding:10px 7px;border-radius:7px;margin:2px 0; }.customer-option.picked { background:#e8f7ed; }.customer-option b { color:#293a56;font-size:11px;display:block; }.customer-option small { color:#8a98ac;font-size:9px;display:block;margin-top:2px; }.calc-body { min-width:0; }.selected-customer { background:white;border:1px solid var(--app-border);border-radius:10px;padding:15px 18px;display:flex;align-items:center;gap:11px; }.avatar { width:35px;height:35px;background:#d9f2e2;color:#117044;border-radius:8px;display:grid;place-items:center;font-weight:700; }.selected-customer p { margin:0;color:#8491a4;font-size:10px; }.selected-customer h3 { margin:4px 0;font-size:15px; }.selected-customer>div:nth-child(2)>span { font-size:10px;color:#607087; }.cycle-chip { margin-left:auto;border-left:1px solid #e8edf4;padding-left:19px; }.cycle-chip span,.cycle-chip b { display:block;font-size:10px; }.cycle-chip span{color:#728198}.cycle-chip b{margin-top:4px;color:#167047}.formula-card { margin-top:13px;padding:17px 20px;background:linear-gradient(110deg,#effaf2,#f9fdf9);border:1px solid #d5ecdd;border-radius:9px; }.formula-label { color:#438565;font-size:10px;margin-bottom:7px; }.formula-card code { font-size:12px;color:#167047;word-break:break-word; }.formula-card p { font-size:10px;color:#61728a;margin:12px 0 0; }.formula-card p b { color:#167047; }.calculation-steps { display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:13px; }.calculation-steps article { border:1px solid var(--app-border);border-radius:8px;background:white;padding:14px; }.calculation-steps span,.calculation-steps small { display:block;font-size:9px;color:#8090a4; }.calculation-steps strong { display:block;margin:8px 0;font-size:16px;letter-spacing:-.04em; }.calculation-steps .result { background:#155a3e;color:white;border-color:#155a3e; }.calculation-steps .result span,.calculation-steps .result small { color:#c3ead3; }.calc-footer { margin-top:13px;background:white;border:1px solid var(--app-border);border-radius:8px;padding:13px 15px;display:flex;align-items:center;justify-content:space-between;gap:15px; }.calc-footer p { margin:0;color:#627188;font-size:10px; }.calc-footer p b { color:#354762; }.calc-footer>div { display:flex;gap:8px; }
.whitelist-summary { grid-template-columns:repeat(3,1fr); }.wh-row { grid-template-columns:1.2fr 1.3fr 1fr 1fr .9fr .65fr; }.table-head input { border:1px solid var(--app-border);border-radius:5px;padding:7px 10px;font-size:11px;outline:none; }.exit-event { margin-top:16px;background:#fffaf2;border:1px solid #f4e3c5;border-radius:8px;padding:15px 17px;display:flex;align-items:center;gap:11px; }.exit-event>span { color:#de9727;font-size:19px; }.exit-event b { font-size:11px; }.exit-event p { margin:3px 0 0;color:#7f7160;font-size:10px; }.exit-event button { margin-left:auto;border:1px solid #eec98c;background:white;color:#ad7113;border-radius:5px;padding:7px 9px;font-size:10px; }
.batch-feature { display:grid;grid-template-columns:230px 1fr;background:linear-gradient(105deg,#123f2f,#237252);color:white;border-radius:11px;overflow:hidden; }.batch-visual { padding:25px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#102f25a6;gap:12px;font-size:11px;color:#c0dfcc; }.progress-ring { width:100px;height:100px;border-radius:50%;background:conic-gradient(#77d69d 0 70%,#70a7883a 70%);display:grid;place-items:center;position:relative; }.progress-ring:after { content:'';position:absolute;inset:9px;background:#185b40;border-radius:50%; }.progress-ring b { z-index:1;font-size:24px; }.progress-ring small { font-size:10px; }.batch-copy { padding:27px 28px; }.batch-copy>p { margin:0;color:#afd8bf;font-size:10px; }.batch-copy h2 { margin:6px 0 15px;font-size:19px; }.task-tags { display:flex;gap:6px;flex-wrap:wrap; }.task-tags span { font-size:10px;background:#3f876688;border:1px solid #6cb58a;padding:4px 7px;border-radius:4px;color:#e0f4e7; }.batch-info { display:flex;gap:44px;margin-top:23px; }.batch-info small,.batch-info b { display:block; }.batch-info small { font-size:9px;color:#afd8bf; }.batch-info b { margin-top:4px;font-size:11px; }.job-list { padding:0 20px 10px;overflow:auto; }.job-list>div { display:grid;grid-template-columns:18px 1.25fr 1.2fr .9fr 1.15fr .55fr;align-items:center;min-height:49px;border-bottom:1px solid #edf0f4;font-size:10px;color:#627188;min-width:700px; }.job-list>div:last-child{border:0}.job-list b{font-size:10px;color:#34455e}.job-status{font-size:12px}.job-status.ok{color:#25a07d}.job-status.wait{color:#e0a43d}.job-list em { font-style:normal;color:#158064;text-align:right; }
.report-filters { display:flex;align-items:end;gap:10px;padding:13px 16px;background:#fff;border:1px solid var(--app-border);border-radius:9px; }.report-filters label { display:grid;gap:5px;color:#60756a;font-size:10px; }.report-filters select { min-width:135px;border:1px solid var(--app-border);border-radius:5px;padding:7px 9px;background:white;color:#355344;font-size:11px; }.report-grid { margin-bottom:17px; }.trend-card { padding-bottom:16px; }.trend-card .panel-title { border:0; }.trend-card .panel-title>b { color:#8a98ac;font-size:9px; }.bars { height:144px;border-bottom:1px solid #dfe5ef;margin:0 22px;display:flex;align-items:end;justify-content:space-around;padding-top:20px;background:repeating-linear-gradient(to bottom,transparent 0,transparent 35px,#eef5f0 36px); }.bars div { background:linear-gradient(#65c98a,#168453);width:35px;min-height:15px;border-radius:4px 4px 0 0;position:relative; }.bars span { position:absolute;bottom:-20px;left:6px;color:#8290a3;font-size:9px; }.trend-value { margin:27px 22px 0;display:flex;align-items:end;gap:9px; }.trend-value b { font-size:23px;color:#167047; }.trend-value span { font-size:10px;color:#6d7d92;margin-bottom:3px; }.alert-count { color:#bf5356;background:#ffeded;border-radius:14px;padding:4px 8px;font-size:11px; }.alert-list { padding:5px 20px; }.alert-list>div { display:flex;align-items:center;gap:9px;padding:12px 0;border-bottom:1px solid #edf0f4; }.alert-list>div:last-child {border:0}.alert-list i { width:18px;height:18px;border-radius:50%;background:#fff0ed;color:#db624d;font-style:normal;display:grid;place-items:center;font-size:11px; }.alert-list p { margin:0;flex:1; }.alert-list b,.alert-list span { display:block; }.alert-list b {font-size:11px}.alert-list span{font-size:10px;color:#8390a4;margin-top:3px}.alert-list button{border:0;background:transparent;color:var(--app-primary-color);font-size:10px}.report-row { grid-template-columns:1.05fr .85fr .95fr .95fr .95fr 1fr .75fr;min-width:780px; }.after-limit { color:#167047;font-weight:700; }
.modal-mask { position:fixed;inset:0;background:#0d2d20a6;display:grid;place-items:center;z-index:5; }.modal { width:420px;background:white;border-radius:11px;padding:24px;position:relative;box-shadow:0 20px 50px #0b152b55; }.modal .close { position:absolute;right:14px;top:11px;border:0;background:transparent;color:#8390a4;font-size:22px; }.modal>p { margin:0;color:var(--app-primary-color);font-size:10px; }.modal h2 { margin:5px 0;font-size:17px; }.modal>span { font-size:10px;color:#738196;line-height:1.6;display:block; }.modal label { display:block;margin-top:14px;color:#526178;font-size:11px; }.modal input,.modal select,.modal textarea { display:block;width:100%;border:1px solid var(--app-border);border-radius:6px;margin-top:6px;padding:9px;outline-color:var(--app-primary-color);background:white; }.modal textarea { min-height:74px;resize:vertical; }.modal>div { display:flex;justify-content:end;gap:8px;margin-top:19px; }
@media (max-width:1050px) { .sidebar { width:178px;flex-basis:178px; }.topbar,.notice,.scroll-area{padding-left:22px;padding-right:22px}.metric-grid,.report-summary{grid-template-columns:repeat(2,1fr)}.calculation-steps{grid-template-columns:repeat(2,1fr)}.two-column,.report-grid{grid-template-columns:1fr}.hero-grid{grid-template-columns:1fr}.limit-orbit{display:none}.tr{min-width:720px}.wh-row{min-width:650px}.audit-row{min-width:760px}.report-filters{flex-wrap:wrap} }
@media (max-width:720px) { .sidebar{width:58px;flex-basis:58px;padding:16px 8px}.brand>div:not(.brand-mark),.environment,.nav-item span:last-child,.side-foot{display:none}.brand{padding:4px 7px 25px}.nav-item{justify-content:center;padding:12px 4px}.topbar{height:66px;flex-basis:66px}.topbar h1{font-size:16px}.date-pill,.user-management i,.user-management em{display:none}.user-management{padding:4px;border-radius:50%}.scroll-area{padding:18px 14px}.notice{padding:8px 14px;font-size:10px}.section-heading{align-items:start;gap:9px}.section-heading h2{font-size:19px}.section-heading .primary{padding:9px}.hero-grid{min-height:245px}.page-intro h2{font-size:21px}.metric-grid,.whitelist-summary,.report-summary{grid-template-columns:1fr 1fr}.calculator-layout{grid-template-columns:1fr}.customer-picker{display:flex;overflow:auto;gap:5px}.picker-head{display:none}.customer-option{min-width:150px;border:1px solid var(--app-border)}.selected-customer{align-items:start}.cycle-chip{display:none}.calc-footer{align-items:start;flex-direction:column}.rule-strip{grid-template-columns:1fr}.batch-feature{grid-template-columns:1fr}.batch-visual{display:none}.batch-info{gap:15px}.top-actions{gap:3px}.report-filters label{flex:1}.report-filters select{min-width:100%}.modal{width:calc(100vw - 32px)} }
</style>
