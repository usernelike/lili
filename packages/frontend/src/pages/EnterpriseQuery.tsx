import { useState } from 'react'
import { Input, Tag } from 'antd'
import { Search, Building2, Users, Gavel, FileText, BadgeCheck, Globe, ExternalLink } from 'lucide-react'
import { useMobile } from '../hooks/useMobile'

const platforms = [
  { name: '天眼查', url: 'https://www.tianyancha.com/search?key=', color: '#3b82f6' },
  { name: '爱企查', url: 'https://aiqicha.baidu.com/s?q=', color: '#8b5cf6' },
  { name: '企查查', url: 'https://www.qcc.com/web/search?key=', color: '#f59e0b' },
]

const dataDimensions = [
  {
    icon: Building2,
    title: '工商信息',
    items: ['企业名称', '统一社会信用代码', '法定代表人', '注册资本', '成立日期', '经营状态', '登记机关', '注册地址', '经营范围'],
    status: '即将接入',
  },
  {
    icon: Users,
    title: '股东与高管',
    items: ['股东信息', '出资比例', '认缴金额', '主要人员', '最终受益人', '实际控制人'],
    status: '即将接入',
  },
  {
    icon: Gavel,
    title: '司法风险',
    items: ['法律诉讼', '失信被执行', '限制消费令', '终本案件', '开庭公告', '法院公告'],
    status: '即将接入',
  },
  {
    icon: FileText,
    title: '经营状况',
    items: ['年报信息', '行政许可', '行政处罚', '经营异常', '股权出质', '动产抵押'],
    status: '即将接入',
  },
  {
    icon: BadgeCheck,
    title: '知识产权',
    items: ['专利信息', '商标信息', '软件著作权', '作品著作权', '资质证书', 'ICP备案'],
    status: '即将接入',
  },
  {
    icon: Globe,
    title: '关联图谱',
    items: ['关联企业', '投资关系', '疑似关系', '历史法人', '分支机构', '集团系谱'],
    status: '即将接入',
  },
]

const hotCompanies = [
  '华为技术有限公司',
  '腾讯科技（深圳）有限公司',
  '阿里巴巴（中国）有限公司',
  '北京字节跳动科技有限公司',
  '比亚迪股份有限公司',
]

export default function EnterpriseQuery() {
  const isMobile = useMobile()
  const [searchValue, setSearchValue] = useState('')
  const [activePlatform, setActivePlatform] = useState(platforms[0])

  const handleSearch = () => {
    if (searchValue.trim()) {
      window.open(activePlatform.url + encodeURIComponent(searchValue.trim()), '_blank')
    }
  }

  const handlePlatformSearch = (platform: typeof platforms[0]) => {
    if (searchValue.trim()) {
      window.open(platform.url + encodeURIComponent(searchValue.trim()), '_blank')
    }
  }

  return (
    <div style={{ padding: isMobile ? '80px 16px 40px' : '100px 40px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 50 }}>
        <h1 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 700, marginBottom: 12 }}>
          企业信息查询
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: isMobile ? 14 : 16 }}>
          即将接入天眼查全量数据库，支持2.8亿+企业多维度查询
        </p>
        <div
          style={{
            marginTop: 16,
            padding: '10px 16px',
            borderRadius: 8,
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            fontSize: isMobile ? 12 : 13,
            color: 'var(--accent-orange)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            maxWidth: 700,
            textAlign: 'left',
          }}
        >
          <span style={{ fontWeight: 600, flexShrink: 0 }}>⚠️ 合规提示：</span>
          <span>企业数据仅用于合法商业决策参考，禁止用于诈骗、骚扰营销、侵犯隐私等违法活动。</span>
        </div>
      </div>

      {/* Search Area */}
      <div
        style={{
          maxWidth: 700,
          margin: '0 auto 50px',
          padding: isMobile ? 20 : 32,
          borderRadius: 20,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {platforms.map((p) => (
            <button
              key={p.name}
              onClick={() => setActivePlatform(p)}
              style={{
                flex: 1,
                padding: isMobile ? '8px 4px' : '10px',
                borderRadius: 10,
                border: '1px solid',
                borderColor: activePlatform.name === p.name ? p.color : 'var(--border-subtle)',
                background: activePlatform.name === p.name ? `${p.color}15` : 'transparent',
                color: activePlatform.name === p.name ? p.color : 'var(--text-muted)',
                fontSize: isMobile ? 12 : 14,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <Input
            size="large"
            placeholder="输入企业名称、统一社会信用代码或法人姓名"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={handleSearch}
            style={{
              paddingLeft: 48,
              paddingRight: isMobile ? 48 : 120,
              height: isMobile ? 44 : 52,
              fontSize: isMobile ? 14 : 16,
              background: 'var(--bg-primary)',
              borderColor: 'var(--border-subtle)',
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              position: 'absolute',
              right: 6,
              top: '50%',
              transform: 'translateY(-50%)',
              padding: isMobile ? '8px 12px' : '10px 24px',
              borderRadius: 10,
              border: 'none',
              background: activePlatform.color,
              color: '#fff',
              fontSize: isMobile ? 13 : 15,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {isMobile ? <Search size={16} /> : <><Search size={16} /> 查询</>}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>热门搜索：</span>
          {hotCompanies.map((company) => (
            <Tag
              key={company}
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 12,
              }}
              onClick={() => {
                setSearchValue(company)
              }}
            >
              {company}
            </Tag>
          ))}
        </div>
      </div>

      {/* Quick Access Buttons */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: isMobile ? 40 : 60, flexWrap: 'wrap' }}>
        {platforms.map((p) => (
          <button
            key={p.name}
            onClick={() => handlePlatformSearch(p)}
            style={{
              padding: isMobile ? '10px 16px' : '12px 24px',
              borderRadius: 12,
              border: `1px solid ${p.color}40`,
              background: `${p.color}10`,
              color: p.color,
              fontSize: isMobile ? 13 : 14,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${p.color}20`
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${p.color}10`
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <ExternalLink size={16} />
            跳转{p.name}搜索
          </button>
        ))}
      </div>

      {/* Data Dimensions */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, marginBottom: 8 }}>
          数据库能力预览
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: isMobile ? 13 : 14 }}>
          接入天眼查开放平台后，将解锁以下全维度企业数据
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 12 : 20,
        }}
      >
        {dataDimensions.map((dim) => {
          const Icon = dim.icon
          return (
            <div
              key={dim.title}
              style={{
                padding: isMobile ? 16 : 24,
                borderRadius: 16,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-glow)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div
                  style={{
                    width: isMobile ? 36 : 40,
                    height: isMobile ? 36 : 40,
                    borderRadius: 10,
                    background: 'rgba(0,212,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={isMobile ? 18 : 20} style={{ color: 'var(--accent-cyan)' }} />
                </div>
                <div>
                  <div style={{ fontSize: isMobile ? 15 : 16, fontWeight: 600 }}>{dim.title}</div>
                  <Tag
                    style={{
                      fontSize: 11,
                      padding: '0 8px',
                      background: 'rgba(245,158,11,0.15)',
                      color: 'var(--accent-orange)',
                      border: 'none',
                    }}
                  >
                    {dim.status}
                  </Tag>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {dim.items.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontSize: 12,
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: 'rgba(255,255,255,0.04)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
