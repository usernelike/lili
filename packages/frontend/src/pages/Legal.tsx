import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Scale, AlertTriangle, Shield, BookOpen, FileWarning } from 'lucide-react'
import { useMobile } from '../hooks/useMobile'

const sections = [
  {
    icon: Scale,
    title: '数据使用合规',
    items: [
      '金融数据来自腾讯证券、新浪财经等公开接口，仅供学习研究',
      '行情数据仅供参考，不构成任何投资建议',
      '企业查询跳转至第三方平台，须遵守对应平台用户协议',
      '禁止高频爬取、批量抓取数据用于商业转售',
    ],
  },
  {
    icon: AlertTriangle,
    title: '禁止行为',
    items: [
      '禁止利用数据从事非法证券咨询、荐股、诱导交易',
      '禁止利用企业数据实施电信诈骗、骚扰营销',
      '禁止大规模爬取、转售企业和金融数据',
      '禁止从事内幕交易、市场操纵等违法行为',
    ],
  },
  {
    icon: Shield,
    title: '免责声明',
    items: [
      '数据来自第三方公开接口，不保证实时性和绝对准确性',
      '投资决策请以交易所和券商官方数据为准',
      '平台为学习项目，不承诺服务的持续可用性',
      '跳转至第三方平台后的行为由用户自行承担责任',
    ],
  },
  {
    icon: BookOpen,
    title: '适用法律',
    items: [
      '《中华人民共和国网络安全法》',
      '《中华人民共和国数据安全法》',
      '《中华人民共和国个人信息保护法》',
      '《中华人民共和国证券法》',
    ],
  },
]

export default function Legal() {
  const navigate = useNavigate()
  const isMobile = useMobile()

  return (
    <div style={{ padding: isMobile ? '80px 16px 40px' : '100px 40px 60px', maxWidth: 900, margin: '0 auto' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 32,
          padding: '8px 16px',
          borderRadius: 10,
          border: '1px solid var(--border-subtle)',
          background: 'transparent',
          color: 'var(--text-secondary)',
          fontSize: 14,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <ArrowLeft size={16} /> 返回
      </button>

      <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 50 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 20px',
            borderRadius: 20,
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.2)',
            color: 'var(--accent-orange)',
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 20,
          }}
        >
          <FileWarning size={14} />
          法律合规
        </div>
        <h1 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 700, marginBottom: 12 }}>法律合规声明</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: isMobile ? 14 : 16, maxWidth: 600, margin: '0 auto' }}>
          lili Hub 仅供学习研究和技术交流使用，使用本平台时必须严格遵守相关法律法规
        </p>
      </div>

      <div
        style={{
          padding: isMobile ? '14px 16px' : 20,
          borderRadius: 12,
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.15)',
          marginBottom: 40,
          textAlign: 'center',
          fontSize: isMobile ? 13 : 14,
          color: 'var(--accent-orange)',
          lineHeight: 1.7,
        }}
      >
        <strong>重要提示</strong>：本平台展示的数据仅供学习参考，不构成任何投资建议或商业担保。
        用户须对使用本平台数据产生的一切后果自行承担责任。如发现利用本平台从事违法违规活动，
        平台保留终止服务并配合有关部门调查的权利。
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 24 }}>
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <div
              key={section.title}
              style={{
                padding: isMobile ? 20 : 28,
                borderRadius: 16,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div
                  style={{
                    width: isMobile ? 36 : 40,
                    height: isMobile ? 36 : 40,
                    borderRadius: 10,
                    background: 'rgba(245,158,11,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={isMobile ? 18 : 20} style={{ color: 'var(--accent-orange)' }} />
                </div>
                <h2 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700 }}>{section.title}</h2>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      fontSize: isMobile ? 13 : 14,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--accent-orange)',
                        marginTop: 7,
                        flexShrink: 0,
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div
        style={{
          marginTop: 40,
          padding: 20,
          borderRadius: 12,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--text-muted)',
        }}
      >
        最后更新：2025年5月 | 如有疑问请通过 GitHub Issues 联系
      </div>
    </div>
  )
}
