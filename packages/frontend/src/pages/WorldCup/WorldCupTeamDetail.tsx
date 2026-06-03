import { useParams, useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import {
  ArrowLeft, Trophy, Users, Shield, Calendar, TrendingUp,
  ChevronRight, Award, Star, Activity, Target, UserCircle
} from 'lucide-react'
import { getTeamById, allTeams, type Player, type RecentMatch } from '../../data/worldcup/teams'
import { groupStageMatches } from '../../data/worldcup/matches'
import { useMobile } from '../../hooks/useMobile'

type DetailTab = 'squad' | 'matches' | 'prediction'

export default function WorldCupTeamDetail() {
  const { teamId } = useParams<{ teamId: string }>()
  const navigate = useNavigate()
  const isMobile = useMobile()
  const [activeTab, setActiveTab] = useState<DetailTab>('squad')

  const team = useMemo(() => {
    if (!teamId) return undefined
    return getTeamById(teamId)
  }, [teamId])

  const teamMatches = useMemo(() => {
    if (!team) return []
    return groupStageMatches.filter(
      m => m.team1 === team.name || m.team2 === team.name
    )
  }, [team])

  const relatedTeams = useMemo(() => {
    if (!team) return []
    return allTeams
      .filter(t => t.group === team.group && t.id !== team.id)
      .slice(0, 3)
  }, [team])

  if (!team) {
    return (
      <div style={{
        paddingTop: isMobile ? 60 : 80,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚽</div>
        <div style={{ fontSize: 18, marginBottom: 8 }}>未找到该球队信息</div>
        <button
          onClick={() => navigate('/worldcup')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 20px',
            borderRadius: 10,
            border: 'none',
            background: 'var(--gradient-accent)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginTop: 16,
          }}
        >
          <ArrowLeft size={16} />
          返回世界杯首页
        </button>
      </div>
    )
  }

  const tabs: { key: DetailTab; label: string; icon: typeof Users }[] = [
    { key: 'squad', label: '阵容', icon: Shield },
    { key: 'matches', label: '战绩', icon: Calendar },
    { key: 'prediction', label: '预测', icon: TrendingUp },
  ]

  // Squad split into starters and substitutes if needed later

  const positionOrder: Record<string, number> = { 'GK': 0, 'DF': 1, 'MF': 2, 'FW': 3 }
  const positionLabel: Record<string, string> = { 'GK': '门将', 'DF': '后卫', 'MF': '中场', 'FW': '前锋' }

  const squadByPosition = useMemo(() => {
    const grouped: Record<string, Player[]> = {}
    team.squad.forEach(p => {
      if (!grouped[p.position]) grouped[p.position] = []
      grouped[p.position].push(p)
    })
    return Object.entries(grouped).sort((a, b) => positionOrder[a[0]] - positionOrder[b[0]])
  }, [team.squad])

  const getResultColor = (result: string) => {
    switch (result) {
      case 'W': return '#22c55e'
      case 'L': return '#ef4444'
      case 'D': return '#f59e0b'
      default: return 'var(--text-muted)'
    }
  }

  const getResultLabel = (result: string) => {
    switch (result) {
      case 'W': return '胜'
      case 'L': return '负'
      case 'D': return '平'
      default: return '-'
    }
  }

  return (
    <div style={{ paddingTop: isMobile ? 60 : 80, minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0d2137 100%)',
        padding: isMobile ? '30px 16px' : '40px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <button
            onClick={() => navigate('/worldcup')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              marginBottom: 20,
              backdropFilter: 'blur(10px)',
            }}
          >
            <ArrowLeft size={14} />
            返回
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 16 : 24,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}>
            <div style={{ fontSize: isMobile ? 60 : 90, lineHeight: 1 }}>{team.flag}</div>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 12px',
                background: 'rgba(0,212,255,0.15)',
                borderRadius: 6,
                marginBottom: 8,
              }}>
                <span style={{ fontSize: 12, color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  {team.group}组 · FIFA 排名 #{team.fifaRank}
                </span>
              </div>
              <h1 style={{
                fontSize: isMobile ? 24 : 36,
                fontWeight: 800,
                color: '#fff',
                margin: '0 0 4px',
              }}>
                {team.name}
              </h1>
              <div style={{ fontSize: isMobile ? 14 : 16, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
                {team.nameEn}
              </div>

              <div style={{
                display: 'flex',
                gap: isMobile ? 8 : 16,
                flexWrap: 'wrap',
              }}>
                {[
                  { icon: UserCircle, label: `主教练：${team.coach}` },
                  { icon: Award, label: `队长：${team.captain}` },
                  { icon: Star, label: `核心：${team.starPlayer}` },
                  { icon: Trophy, label: team.worldCupTitles > 0 ? `冠军 ×${team.worldCupTitles}` : '无冠军' },
                ].map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 12px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      backdropFilter: 'blur(10px)',
                    }}>
                      <Icon size={14} color="var(--accent-cyan)" />
                      <span style={{ fontSize: 12, color: '#fff' }}>{item.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 40px' }}>
        {/* Group Rivals */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginBottom: 24,
          overflowX: 'auto',
          paddingBottom: 4,
        }}>
          <div style={{
            padding: '10px 16px',
            background: 'var(--bg-secondary)',
            borderRadius: 10,
            border: '1px solid var(--border-subtle)',
            fontSize: 13,
            color: 'var(--text-muted)',
            whiteSpace: 'nowrap',
          }}>
            同组对手：
          </div>
          {relatedTeams.map(t => (
            <div
              key={t.id}
              onClick={() => navigate(`/worldcup/team/${t.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                background: 'var(--bg-secondary)',
                borderRadius: 10,
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-cyan)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
              }}
            >
              <span style={{ fontSize: 20 }}>{t.flag}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</span>
              <ChevronRight size={14} color="var(--text-muted)" />
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 12,
        }}>
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: isActive ? 'rgba(0,212,255,0.12)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Squad Tab */}
        {activeTab === 'squad' && (
          <div>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 16,
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
              marginBottom: 24,
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Shield size={18} color="var(--accent-cyan)" />
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>球队阵容</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  共 {team.squad.length} 人
                </span>
              </div>

              {squadByPosition.map(([pos, players]) => (
                <div key={pos} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{
                    padding: '10px 20px',
                    background: 'rgba(0,0,0,0.2)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--accent-cyan)',
                  }}>
                    {positionLabel[pos]} ({players.length}人)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                    {players.map((player, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          borderBottom: idx < players.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                          borderRight: !isMobile && idx % 2 === 0 ? '1px solid var(--border-subtle)' : 'none',
                        }}
                      >
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: player.isStarter ? 'var(--gradient-accent)' : 'var(--bg-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          fontWeight: 700,
                          color: player.isStarter ? '#fff' : 'var(--text-muted)',
                          flexShrink: 0,
                        }}>
                          {player.number}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                            {player.name}
                            {player.isStarter && (
                              <span style={{
                                marginLeft: 8,
                                padding: '1px 6px',
                                background: 'rgba(0,212,255,0.15)',
                                borderRadius: 4,
                                fontSize: 10,
                                color: 'var(--accent-cyan)',
                              }}>
                                首发
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                            {player.club} · {player.age}岁
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* World Cup Schedule */}
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 16,
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <Calendar size={18} color="var(--accent-cyan)" />
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>世界杯小组赛赛程</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {teamMatches.map((match, idx) => {
                  const isTeam1 = match.team1 === team.name
                  const opponent = isTeam1 ? match.team2 : match.team1
                  const opponentFlag = isTeam1 ? match.team2Flag : match.team1Flag
                  return (
                    <div
                      key={match.id}
                      style={{
                        padding: '14px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        borderBottom: idx < teamMatches.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        flexWrap: isMobile ? 'wrap' : 'nowrap',
                      }}
                    >
                      <div style={{ minWidth: 90 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{match.date}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{match.time}</div>
                      </div>
                      <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 12,
                        minWidth: 160,
                      }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {isTeam1 ? '主场' : '客场'} vs
                        </span>
                        <span style={{ fontSize: 24 }}>{opponentFlag}</span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{opponent}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 100, textAlign: isMobile ? 'left' : 'right' }}>
                        {match.venue}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 16,
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
              marginBottom: 24,
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Activity size={18} color="var(--accent-cyan)" />
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>近期战绩</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>近5场比赛</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {team.recentMatches.map((match: RecentMatch, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      borderBottom: idx < team.recentMatches.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      flexWrap: isMobile ? 'wrap' : 'nowrap',
                    }}
                  >
                    <div style={{ minWidth: 100 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{match.date}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{match.competition}</div>
                    </div>
                    <div style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 12,
                      minWidth: 180,
                    }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{team.name}</span>
                      <span style={{ fontSize: 20 }}>{team.flag}</span>
                      <div style={{
                        padding: '4px 14px',
                        background: `${getResultColor(match.result)}20`,
                        borderRadius: 6,
                        fontSize: 16,
                        fontWeight: 800,
                        color: getResultColor(match.result),
                        minWidth: 60,
                        textAlign: 'center',
                      }}>
                        {match.score}
                      </div>
                      <span style={{ fontSize: 20 }}>{match.opponentFlag}</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{match.opponent}</span>
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      borderRadius: 6,
                      background: `${getResultColor(match.result)}15`,
                      color: getResultColor(match.result),
                      fontSize: 12,
                      fontWeight: 700,
                      minWidth: 36,
                      textAlign: 'center',
                    }}>
                      {getResultLabel(match.result)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: 16,
            }}>
              {(() => {
                const wins = team.recentMatches.filter(m => m.result === 'W').length
                const draws = team.recentMatches.filter(m => m.result === 'D').length
                const losses = team.recentMatches.filter(m => m.result === 'L').length
                const gf = team.recentMatches.reduce((sum, m) => sum + parseInt(m.score.split('-')[0]), 0)
                const ga = team.recentMatches.reduce((sum, m) => sum + parseInt(m.score.split('-')[1]), 0)
                return [
                  { label: '近5场胜率', value: `${Math.round((wins / 5) * 100)}%`, icon: Target },
                  { label: '胜/平/负', value: `${wins}/${draws}/${losses}`, icon: Activity },
                  { label: '总进球', value: gf.toString(), icon: Trophy },
                  { label: '总失球', value: ga.toString(), icon: Shield },
                ].map((stat, idx) => {
                  const Icon = stat.icon
                  return (
                    <div key={idx} style={{
                      padding: '20px',
                      background: 'var(--bg-secondary)',
                      borderRadius: 12,
                      border: '1px solid var(--border-subtle)',
                      textAlign: 'center',
                    }}>
                      <Icon size={24} color="var(--accent-cyan)" style={{ marginBottom: 8 }} />
                      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{stat.value}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stat.label}</div>
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        )}

        {/* Prediction Tab */}
        {activeTab === 'prediction' && (
          <div>
            {/* Prediction Card */}
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 16,
              border: '1px solid var(--border-subtle)',
              padding: isMobile ? '20px' : '28px',
              marginBottom: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <TrendingUp size={20} color="var(--accent-cyan)" />
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>世界杯预测分析</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: 16,
                marginBottom: 24,
              }}>
                <div style={{
                  padding: '20px',
                  background: 'var(--bg-primary)',
                  borderRadius: 12,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>小组出线预测</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-cyan)' }}>{team.prediction.groupStage}</div>
                </div>
                <div style={{
                  padding: '20px',
                  background: 'var(--bg-primary)',
                  borderRadius: 12,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>晋级概率</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#22c55e' }}>{team.prediction.winProbability}%</div>
                </div>
                <div style={{
                  padding: '20px',
                  background: 'var(--bg-primary)',
                  borderRadius: 12,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>夺冠概率</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#f59e0b' }}>{team.prediction.championProbability}%</div>
                </div>
              </div>

              <div style={{
                padding: '16px 20px',
                background: 'var(--bg-primary)',
                borderRadius: 12,
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>分析点评</div>
                <div style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.7 }}>
                  {team.prediction.analysis}
                </div>
              </div>
            </div>

            {/* Team Info */}
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 16,
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <Users size={18} color="var(--accent-cyan)" />
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>球队档案</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                {[
                  { label: '世界杯最佳战绩', value: team.bestResult },
                  { label: '世界杯冠军次数', value: team.worldCupTitles > 0 ? `${team.worldCupTitles} 次` : '0 次' },
                  { label: '现任主教练', value: team.coach },
                  { label: '球队队长', value: team.captain },
                  { label: '核心球星', value: team.starPlayer },
                  { label: 'FIFA世界排名', value: `第 ${team.fifaRank} 位` },
                  { label: '所在小组', value: `${team.group}组` },
                  { label: '阵容人数', value: `${team.squad.length} 人` },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px 20px',
                      borderBottom: '1px solid var(--border-subtle)',
                      borderRight: !isMobile && idx % 2 === 0 ? '1px solid var(--border-subtle)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
