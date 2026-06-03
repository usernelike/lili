import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, Calendar, Users, TrendingUp, ChevronRight, Clock, MapPin, Filter, Search } from 'lucide-react'
import { allTeams, groups, getTeamById } from '../../data/worldcup/teams'
import { groupStageMatches, allMatches } from '../../data/worldcup/matches'
import { useMobile } from '../../hooks/useMobile'

type TabType = 'groups' | 'schedule' | 'prediction'

export default function WorldCup() {
  const navigate = useNavigate()
  const isMobile = useMobile()
  const [activeTab, setActiveTab] = useState<TabType>('groups')
  const [selectedGroup, setSelectedGroup] = useState<string>('A')
  const [searchQuery, setSearchQuery] = useState('')
  const [scheduleFilter, setScheduleFilter] = useState<string>('all')

  const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return []
    return allTeams.filter(t =>
      t.name.includes(searchQuery) ||
      t.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const championCandidates = useMemo(() => {
    return [...allTeams]
      .sort((a, b) => b.prediction.championProbability - a.prediction.championProbability)
      .slice(0, 10)
  }, [])

  const filteredMatches = useMemo(() => {
    if (scheduleFilter === 'all') return allMatches
    if (scheduleFilter === 'group') return groupStageMatches
    return allMatches.filter(m => m.round === scheduleFilter)
  }, [scheduleFilter])

  const getTeamIdByName = (name: string): string => {
    const team = allTeams.find(t => t.name === name)
    return team?.id || ''
  }

  const handleTeamClick = (teamId: string) => {
    if (teamId) navigate(`/worldcup/team/${teamId}`)
  }

  const tabs = [
    { key: 'groups' as TabType, label: '分组', icon: Users },
    { key: 'schedule' as TabType, label: '赛程', icon: Calendar },
    { key: 'prediction' as TabType, label: '夺冠预测', icon: TrendingUp },
  ]

  return (
    <div style={{ paddingTop: isMobile ? 60 : 80, minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero Header */}
      <div style={{
        padding: isMobile ? '40px 16px' : '60px 40px',
        background: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0d2137 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          fontSize: isMobile ? 80 : 180,
          opacity: 0.08,
          filter: 'grayscale(100%)',
        }}>🏆</div>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            background: 'rgba(0,212,255,0.15)',
            borderRadius: 20,
            border: '1px solid rgba(0,212,255,0.3)',
            marginBottom: 20,
          }}>
            <Trophy size={14} color="var(--accent-cyan)" />
            <span style={{ fontSize: 13, color: 'var(--accent-cyan)', fontWeight: 500 }}>2026 FIFA WORLD CUP</span>
          </div>
          <h1 style={{
            fontSize: isMobile ? 28 : 48,
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 12px',
            lineHeight: 1.2,
          }}>
            2026 美加墨世界杯
          </h1>
          <p style={{
            fontSize: isMobile ? 14 : 18,
            color: 'rgba(255,255,255,0.7)',
            margin: '0 0 24px',
            maxWidth: 600,
            lineHeight: 1.6,
          }}>
            史上首次48支球队参赛、美加墨三国联合主办
            <br />
            2026年6月11日 - 7月19日 · 104场精彩对决
          </p>
          <div style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 8,
              backdropFilter: 'blur(10px)',
            }}>
              <Calendar size={16} color="var(--accent-cyan)" />
              <span style={{ fontSize: 13, color: '#fff' }}>6月12日 03:00 揭幕战</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 8,
              backdropFilter: 'blur(10px)',
            }}>
              <MapPin size={16} color="var(--accent-cyan)" />
              <span style={{ fontSize: 13, color: '#fff' }}>16座城市 · 3个国家</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 40px' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            background: 'var(--bg-secondary)',
            borderRadius: 12,
            border: '1px solid var(--border-subtle)',
          }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="搜索球队（中文/英文）..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: 18,
                }}
              >
                ×
              </button>
            )}
          </div>
          {searchQuery && filteredTeams.length > 0 && (
            <div style={{
              marginTop: 8,
              padding: 12,
              background: 'var(--bg-secondary)',
              borderRadius: 12,
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
              {filteredTeams.map(team => (
                <div
                  key={team.id}
                  onClick={() => handleTeamClick(team.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,212,255,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <span style={{ fontSize: 24 }}>{team.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{team.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{team.nameEn} · FIFA排名 #{team.fifaRank}</div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 12,
          overflowX: 'auto',
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
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div>
            {/* Group Selector */}
            <div style={{
              display: 'flex',
              gap: 8,
              marginBottom: 24,
              flexWrap: 'wrap',
            }}>
              {groupLetters.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGroup(g)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    border: 'none',
                    background: selectedGroup === g ? 'var(--gradient-accent)' : 'var(--bg-secondary)',
                    color: selectedGroup === g ? '#fff' : 'var(--text-secondary)',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                  }}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Group Table */}
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
                gap: 8,
              }}>
                <Users size={18} color="var(--accent-cyan)" />
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{selectedGroup}组</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>球队</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, width: 60 }}>FIFA</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, width: 80 }}>世界杯</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>最佳战绩</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>核心球员</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups[selectedGroup]?.map((teamId, idx) => {
                      const team = getTeamById(teamId)
                      if (!team) return null
                      return (
                        <tr
                          key={teamId}
                          style={{
                            borderBottom: idx < 3 ? '1px solid var(--border-subtle)' : 'none',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                          onClick={() => handleTeamClick(teamId)}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,212,255,0.05)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                        >
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{ fontSize: 28 }}>{team.flag}</span>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{team.name}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{team.nameEn}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
                            #{team.fifaRank}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
                            {team.worldCupTitles > 0 ? `🏆 ×${team.worldCupTitles}` : '-'}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
                            {team.bestResult}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--accent-cyan)' }}>
                            {team.starPlayer}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* All Teams Grid */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px' }}>全部48支参赛球队</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: 12,
              }}>
                {allTeams.map(team => (
                  <div
                    key={team.id}
                    onClick={() => handleTeamClick(team.id)}
                    style={{
                      padding: '14px 16px',
                      background: 'var(--bg-secondary)',
                      borderRadius: 12,
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-cyan)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{team.flag}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{team.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{team.nameEn}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div>
            {/* Filter */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 20,
              flexWrap: 'wrap',
            }}>
              <Filter size={16} color="var(--text-muted)" />
              {[
                { key: 'all', label: '全部' },
                { key: 'group', label: '小组赛' },
                { key: '1/16决赛', label: '1/16决赛' },
                { key: '1/8决赛', label: '1/8决赛' },
                { key: '1/4决赛', label: '1/4决赛' },
                { key: '半决赛', label: '半决赛' },
                { key: '决赛', label: '决赛' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setScheduleFilter(f.key)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background: scheduleFilter === f.key ? 'rgba(0,212,255,0.12)' : 'var(--bg-secondary)',
                    color: scheduleFilter === f.key ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Matches List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredMatches.map(match => {
                const team1Id = getTeamIdByName(match.team1)
                const team2Id = getTeamIdByName(match.team2)
                return (
                  <div
                    key={match.id}
                    style={{
                      padding: isMobile ? '14px' : '18px 20px',
                      background: 'var(--bg-secondary)',
                      borderRadius: 12,
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: isMobile ? 12 : 20,
                      flexWrap: isMobile ? 'wrap' : 'nowrap',
                    }}
                  >
                    {/* Date & Time */}
                    <div style={{
                      minWidth: isMobile ? '100%' : 100,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                      <Clock size={14} color="var(--accent-cyan)" />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{match.date}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{match.time}</div>
                      </div>
                    </div>

                    {/* Teams */}
                    <div style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 12,
                      minWidth: 200,
                    }}>
                      <div
                        onClick={() => handleTeamClick(team1Id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          cursor: team1Id ? 'pointer' : 'default',
                          flex: 1,
                          justifyContent: 'flex-end',
                        }}
                      >
                        <span style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          textAlign: 'right',
                        }}>{match.team1}</span>
                        <span style={{ fontSize: 24 }}>{match.team1Flag}</span>
                      </div>
                      <div style={{
                        padding: '4px 12px',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        minWidth: 50,
                        textAlign: 'center',
                      }}>
                        VS
                      </div>
                      <div
                        onClick={() => handleTeamClick(team2Id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          cursor: team2Id ? 'pointer' : 'default',
                          flex: 1,
                        }}
                      >
                        <span style={{ fontSize: 24 }}>{match.team2Flag}</span>
                        <span style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                        }}>{match.team2}</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{
                      minWidth: isMobile ? '100%' : 160,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      alignItems: isMobile ? 'flex-start' : 'flex-end',
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        padding: '2px 10px',
                        borderRadius: 4,
                        background: match.round === '小组赛' ? 'rgba(0,212,255,0.1)' : 'rgba(255,183,77,0.1)',
                        color: match.round === '小组赛' ? 'var(--accent-cyan)' : '#ffb74d',
                        fontSize: 11,
                        fontWeight: 600,
                      }}>
                        {match.group !== '32强' && match.group !== '16强' && match.group !== '8强' && match.group !== '4强' && match.group !== '决赛'
                          ? `${match.group}组 · ${match.round}`
                          : match.round}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} />
                        {match.venue}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Prediction Tab */}
        {activeTab === 'prediction' && (
          <div>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 16,
              border: '1px solid var(--border-subtle)',
              padding: isMobile ? '20px' : '28px',
              marginBottom: 24,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Trophy size={20} color="var(--accent-cyan)" />
                夺冠概率排行榜
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {championCandidates.map((team, idx) => (
                  <div
                    key={team.id}
                    onClick={() => handleTeamClick(team.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: isMobile ? 10 : 16,
                      padding: '12px 16px',
                      background: 'var(--bg-primary)',
                      borderRadius: 12,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: idx < 3 ? 'var(--gradient-accent)' : 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 800,
                      color: idx < 3 ? '#fff' : 'var(--text-muted)',
                      flexShrink: 0,
                    }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{team.flag}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{team.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{team.prediction.analysis}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-cyan)' }}>{team.prediction.championProbability}%</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>夺冠概率</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: 16,
            }}>
              {[
                { label: '参赛球队', value: '48', icon: Users },
                { label: '总比赛场次', value: '104', icon: Calendar },
                { label: '举办城市', value: '16', icon: MapPin },
                { label: '卫冕冠军', value: '🇦🇷 阿根廷', icon: Trophy },
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
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
