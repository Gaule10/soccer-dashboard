import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Upload, FileDown, Trash2, Users, TrendingUp, Target, Activity, Video, Lightbulb, CheckCircle2, Play, ChevronDown } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// --- 1. Analytics Dashboard Component (Updated with Match Toggles) ---
const AnalyticsDashboard = () => {
  // Restructured Data: Players -> Matches -> Stats
  const demoData = [
    {
      id: 'p1',
      name: 'Lionel Messi',
      team: 'Inter Miami',
      position: 'FW',
      matches: [
        {
          id: 'm1',
          opponent: 'vs Orlando City',
          date: 'Mar 2, 2024',
          pass: 88, passAttempts: 65,
          dribble: 92, dribbleAttempts: 12,
          dual: 60, dualAttempts: 15,
          interception: 25, interceptionAttempts: 2,
          goals: 2, assists: 1,
          // Example YouTube Embed URL
          videoUrl: "https://www.youtube.com/embed/p7T-WSC9Puw", 
          insights: [
            "Exceptional vision in the final third, creating 2 big chances.",
            "Dribbling success rate (92%) broke defensive lines effectively.",
          ],
          actions: [
            "Continue to drift into the half-spaces to overload midfield.",
            "Look for diagonal through balls to breaking wingers."
          ]
        },
        {
          id: 'm2',
          opponent: 'vs LA Galaxy',
          date: 'Feb 25, 2024',
          pass: 82, passAttempts: 58,
          dribble: 85, dribbleAttempts: 14,
          dual: 55, dualAttempts: 18,
          interception: 30, interceptionAttempts: 3,
          goals: 1, assists: 0,
          videoUrl: "", // Empty URL to test fallback state
          insights: [
            "Heavily marked, forcing deeper positioning to collect the ball.",
            "Link-up play was solid despite high pressure."
          ],
          actions: [
            "Release ball quicker against double teams.",
            "Target free kicks to near post."
          ]
        }
      ]
    },
    {
      id: 'p2',
      name: 'Kevin De Bruyne',
      team: 'Man City',
      position: 'MF',
      matches: [
        {
          id: 'm1',
          opponent: 'vs Liverpool',
          date: 'Mar 10, 2024',
          pass: 89, passAttempts: 75,
          dribble: 80, dribbleAttempts: 5,
          dual: 65, dualAttempts: 12,
          interception: 70, interceptionAttempts: 8,
          goals: 0, assists: 1,
          videoUrl: "https://www.youtube.com/embed/ExampleID2",
          insights: [
            "Controlled tempo in midfield against a high press.",
            "Corner kick delivery created the opening goal."
          ],
          actions: [
            "Look for Haaland on early crosses.",
            "Manage stamina for late game transition defense."
          ]
        },
        {
          id: 'm2',
          opponent: 'vs Man United',
          date: 'Mar 3, 2024',
          pass: 94, passAttempts: 82,
          dribble: 88, dribbleAttempts: 6,
          dual: 70, dualAttempts: 10,
          interception: 60, interceptionAttempts: 5,
          goals: 0, assists: 2,
          insights: [
            "Dominated possession in the final third.",
            "Through balls were lethal against the low block."
          ],
          actions: [
            "Shoot more frequently from outside the box.",
            "Lead the high press triggers."
          ]
        }
      ]
    },
    {
      id: 'p3',
      name: 'Virgil van Dijk',
      team: 'Liverpool',
      position: 'DF',
      matches: [
        {
          id: 'm1',
          opponent: 'vs Man City',
          date: 'Mar 10, 2024',
          pass: 85, passAttempts: 60,
          dribble: 100, dribbleAttempts: 1,
          dual: 90, dualAttempts: 10,
          interception: 88, interceptionAttempts: 12,
          goals: 0, assists: 0,
          insights: [
            "Dominant in aerial duels, neutralizing corners.",
            "Excellent positioning prevented 1v1 situations."
          ],
          actions: [
            "Organize the defensive line height on counters.",
            "Look for long diagonals to Salah."
          ]
        }
      ]
    }
  ];

  const [players, setPlayers] = useState(demoData);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [useDemo, setUseDemo] = useState(true);
  
  // Initialize selection
  useEffect(() => {
    if (players.length > 0 && !selectedPlayer) {
      const firstPlayer = players[0];
      setSelectedPlayer(firstPlayer);
      if (firstPlayer.matches?.length > 0) {
        setSelectedMatch(firstPlayer.matches[0]);
      }
    }
  }, [players, selectedPlayer]); 

  const handlePlayerChange = (e) => {
    const playerName = e.target.value;
    const player = players.find(p => p.name === playerName);
    setSelectedPlayer(player);
    // Reset match to the first one for the new player
    if (player && player.matches?.length > 0) {
      setSelectedMatch(player.matches[0]);
    } else {
      setSelectedMatch(null);
    }
  };

  const handleMatchChange = (e) => {
    const matchId = e.target.value;
    if (selectedPlayer) {
      const match = selectedPlayer.matches.find(m => m.id === matchId);
      setSelectedMatch(match);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n');
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        
        // Adapt flat CSV to new nested structure
        const parsedPlayers = rows.slice(1).filter(row => row.trim()).map((row, index) => {
          const values = row.split(',');
          const rowData = {};
          headers.forEach((header, idx) => {
            const value = values[idx]?.trim();
            rowData[header] = isNaN(value) ? value : Number(value);
          });

          // Create a player object wrapping the row data as a single "Uploaded Match"
          return {
            id: `upload-${index}`,
            name: rowData.player || 'Unknown Player',
            team: rowData.team || 'Unknown Team',
            position: rowData.position || 'N/A',
            matches: [{
              id: `match-upload-${index}`,
              opponent: 'Uploaded Match Data',
              date: new Date().toLocaleDateString(),
              pass: rowData.pass || 0,
              passAttempts: rowData.passattempts || 0,
              dribble: rowData.dribble || 0,
              dribbleAttempts: rowData.dribbleattempts || 0,
              dual: rowData.dual || 0,
              dualAttempts: rowData.dualattempts || 0,
              interception: rowData.interception || 0,
              interceptionAttempts: rowData.interceptionattempts || 0,
              goals: rowData.goals || 0,
              assists: rowData.assists || 0,
              // Map video url column if it exists in CSV
              videoUrl: rowData.videourl || "",
              insights: ["Data sourced from CSV upload."],
              actions: ["Review uploaded metrics."]
            }]
          };
        });
        
        setPlayers(parsedPlayers);
        if (parsedPlayers.length > 0) {
          const firstP = parsedPlayers[0];
          setSelectedPlayer(firstP);
          if (firstP.matches.length > 0) setSelectedMatch(firstP.matches[0]);
        }
        setUseDemo(false);
      };
      reader.readAsText(file);
    }
  };

  const getRadarData = () => {
    if (!selectedMatch) return [];
    return [
      { stat: 'Pass', value: selectedMatch.pass || 0 },
      { stat: 'Dribble', value: selectedMatch.dribble || 0 },
      { stat: 'Dual', value: selectedMatch.dual || 0 },
      { stat: 'Interception', value: selectedMatch.interception || 0 }
    ];
  };

  const calculateSuccessful = (percentage, attempts) => {
    return Math.round((percentage / 100) * attempts);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-full rounded-b-xl">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Right Actions (Small Format) */}
        <div className="flex justify-end gap-3 mb-2">
          <button
            onClick={() => {
              setUseDemo(true);
              setPlayers(demoData);
              const p = demoData[0];
              setSelectedPlayer(p);
              setSelectedMatch(p.matches[0]);
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1 ${
              useDemo
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <Activity className="w-3 h-3" />
            Use Demo Data
          </button>
          <label className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition flex items-center gap-1 ${
            !useDemo
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          }`}>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Upload className="w-3 h-3" />
            Upload CSV
          </label>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-4">
            {/* UPDATED: Logo Image */}
            <img 
              src="/logo.png" 
              alt="FC360 Logo" 
              className="w-16 h-16 object-contain bg-white rounded-xl p-1 shadow-lg" 
            />
            FC360 Analytics
          </h1>
          <p className="text-blue-200 text-lg">Complete Player Performance Dashboard</p>
        </div>

        {/* Controls Bar - Centered Dropdowns */}
        {players.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-blue-500/20 p-4 mb-6 flex justify-center">
            <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/50 p-2 rounded-lg border border-slate-700">
              {/* 1. Player Dropdown */}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <select
                  value={selectedPlayer?.name || ''}
                  onChange={handlePlayerChange}
                  className="bg-slate-700 border border-slate-600 text-white text-sm rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none min-w-[200px]"
                >
                  {players.map((player) => (
                    <option key={player.id} value={player.name}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Match Dropdown */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-400" />
                <select
                  value={selectedMatch?.id || ''}
                  onChange={handleMatchChange}
                  disabled={!selectedPlayer || !selectedPlayer.matches?.length}
                  className="bg-slate-700 border border-slate-600 text-white text-sm rounded px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none min-w-[200px] disabled:opacity-50"
                >
                  {selectedPlayer?.matches?.map((match) => (
                    <option key={match.id} value={match.id}>
                      {match.opponent} ({match.date})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {selectedPlayer && selectedMatch ? (
          <div className="space-y-6">
            {/* Row 1: Stats and Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Player Info Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-blue-500/20 p-6 h-fit">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {selectedPlayer.name?.charAt(0) || 'P'}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {selectedPlayer.name}
                  </h2>
                  <p className="text-blue-400 font-medium">{selectedPlayer.team}</p>
                  <div className="mt-2 flex justify-center gap-2">
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedPlayer.position}
                    </span>
                    <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedMatch.opponent}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h3 className="font-semibold text-gray-200 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    Match Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-green-400">
                        {selectedMatch.goals || 0}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Goals</div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-blue-400">
                        {selectedMatch.assists || 0}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Assists</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Radar Chart & Stats */}
              <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-blue-500/20 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                    Performance Analysis
                  </h3>
                  <span className="text-sm text-gray-400">{selectedMatch.date}</span>
                </div>
                
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={getRadarData()}>
                    <PolarGrid stroke="#475569" />
                    <PolarAngleAxis
                      dataKey="stat"
                      tick={{ fill: '#cbd5e1', fontSize: 13, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Radar
                      name={selectedPlayer.name}
                      dataKey="value"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      strokeWidth={3}
                    />
                  </RadarChart>
                </ResponsiveContainer>

                {/* Detailed Stats */}
                <div className="mt-6 space-y-4">
                  {/* Pass */}
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-200">Pass</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-blue-400">{selectedMatch.pass}%</span>
                        <div className="text-xs text-gray-400">
                          {calculateSuccessful(selectedMatch.pass, selectedMatch.passAttempts)}/{selectedMatch.passAttempts} successful
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${selectedMatch.pass}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Dribble */}
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-200">Dribble</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-purple-400">{selectedMatch.dribble}%</span>
                        <div className="text-xs text-gray-400">
                          {calculateSuccessful(selectedMatch.dribble, selectedMatch.dribbleAttempts)}/{selectedMatch.dribbleAttempts} successful
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${selectedMatch.dribble}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Dual */}
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-200">Dual</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-orange-400">{selectedMatch.dual}%</span>
                        <div className="text-xs text-gray-400">
                          {calculateSuccessful(selectedMatch.dual, selectedMatch.dualAttempts)}/{selectedMatch.dualAttempts} successful
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${selectedMatch.dual}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Interception */}
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-200">Interception</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-green-400">{selectedMatch.interception}%</span>
                        <div className="text-xs text-gray-400">
                          {calculateSuccessful(selectedMatch.interception, selectedMatch.interceptionAttempts)}/{selectedMatch.interceptionAttempts} successful
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${selectedMatch.interception}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Video & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Video Component */}
              <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-blue-500/20 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Video className="w-6 h-6 text-blue-400" />
                  Match Analysis Video
                </h3>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-700">
                  {selectedMatch.videoUrl ? (
                    <iframe 
                      src={selectedMatch.videoUrl} 
                      title="Match Analysis"
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    /* Fallback for matches without video */
                    <div className="flex items-center justify-center h-full flex-col">
                      <div className="p-4 bg-slate-800 rounded-full mb-3">
                         <Video className="w-8 h-8 text-slate-500" />
                      </div>
                      <p className="text-slate-400">No video available for this match</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Insights & Actions Component */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-blue-500/20 p-6 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-400" />
                    Coach's Insights
                  </h3>
                  <ul className="space-y-3">
                    {selectedMatch.insights?.map((insight, index) => (
                      <li key={index} className="flex gap-3 text-gray-300 text-sm">
                        <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-yellow-400 flex-shrink-0"></span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    Action Plan
                  </h3>
                  <div className="space-y-3">
                    {selectedMatch.actions?.map((action, index) => (
                      <div key={index} className="bg-slate-700/50 p-3 rounded-lg border border-slate-600/50">
                        <p className="text-sm text-blue-100 font-medium">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-blue-500/20 p-12 text-center">
            <Upload className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-200 mb-2">No Data Available</h3>
            <p className="text-gray-400 mb-6">
              Upload a CSV file or use demo data to get started
            </p>
            <div className="bg-slate-900/50 rounded-lg p-4 text-left max-w-2xl mx-auto">
              <p className="font-medium text-gray-300 mb-2">Expected CSV Format:</p>
              <code className="text-sm text-blue-300 block">
                player,team,position,pass,passAttempts,dribble,dribbleAttempts,dual,dualAttempts,interception,interceptionAttempts,goals,assists
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// --- 2. Soccer Pitch Tagger Component ---
const TaggerApp = () => {
  const canvasRef = useRef(null);
  const [lineColor] = useState('#ffffff');
  const [fieldColor] = useState('#1b4f18');
  const [selectedAction, setSelectedAction] = useState(null);
  const [events, setEvents] = useState([]);
  const [showData, setShowData] = useState(false);
  
  // State for tracking action workflow
  const [currentStep, setCurrentStep] = useState('select_action'); // select_action, start_location, end_location, success
  const [tempAction, setTempAction] = useState(null);

  const actions = [
    { name: 'Pass', color: '#3b82f6', icon: '⚽' },
    { name: 'Dribble', color: '#10b981', icon: '🏃' },
    { name: 'Dual', color: '#f59e0b', icon: '⚔️' },
    { name: 'Interception', color: '#ef4444', icon: '🛡️' }
  ];

  const drawAll = () => {
    drawPitch();
    drawEvents();
    drawTempAction();
  };

  useEffect(() => {
    drawAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineColor, fieldColor, events, tempAction]);

  const drawPitch = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Define consistent canvas dimensions
    const canvasWidth = 1000;
    const canvasHeight = 700;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    ctx.fillStyle = fieldColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Pitch dimensions (900x600 drawing area)
    const length = 900;
    const width = 600;
    const offsetX = 50;
    const offsetY = 50;
    
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = lineColor;
    ctx.lineWidth = 2;
    
    const drawRect = (x, y, w, h, fill = false) => {
      ctx.beginPath();
      ctx.rect(offsetX + x, offsetY + y, w, h);
      if (fill) ctx.fill();
      else ctx.stroke();
    };
    
    const drawCircle = (x, y, radius, fill = false) => {
      ctx.beginPath();
      ctx.arc(offsetX + x, offsetY + y, radius, 0, Math.PI * 2);
      if (fill) ctx.fill();
      else ctx.stroke();
    };
    
    const drawArc = (x, y, radius, startAngle, endAngle) => {
      ctx.beginPath();
      ctx.arc(offsetX + x, offsetY + y, radius, startAngle * Math.PI / 180, endAngle * Math.PI / 180);
      ctx.stroke();
    };
    
    // Scaling factor (120 yards pitch length mapped to 900px)
    const scale = length / 120;
    
    // Outer boundary
    drawRect(0, 0, length, width); 
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(offsetX + length/2, offsetY);
    ctx.lineTo(offsetX + length/2, offsetY + width);
    ctx.stroke();
    
    // Center circle and center spot
    drawCircle(length/2, width/2, 10 * scale);
    drawCircle(length/2, width/2, 0.8 * scale, true);
    
    // Penalty areas (18-yard box)
    drawRect(0, (width/2) - 22 * scale, 18 * scale, 44 * scale);
    drawRect(length - 18 * scale, (width/2) - 22 * scale, 18 * scale, 44 * scale);
    
    // Goal areas (6-yard box)
    drawRect(0, (width/2) - 10 * scale, 6 * scale, 20 * scale);
    drawRect(length - 6 * scale, (width/2) - 10 * scale, 6 * scale, 20 * scale);
    
    // Penalty spots
    drawCircle(12 * scale, width/2, 0.8 * scale, true);
    drawCircle(length - 12 * scale, width/2, 0.8 * scale, true);
    
    // Penalty arcs
    drawArc(12 * scale, width/2, 10 * scale, -52, 52);
    drawArc(length - 12 * scale, width/2, 10 * scale, 128, 232);
    
    // Goals (simple markers)
    drawRect(-3 * scale, (width/2) - 4 * scale, 3 * scale, 8 * scale);
    drawRect(length, (width/2) - 4 * scale, 3 * scale, 8 * scale);
    
    // Corner arcs
    drawArc(0, 0, 2 * scale, 0, 90);
    drawArc(0, width, 2 * scale, 270, 360);
    drawArc(length, width, 2 * scale, 180, 270);
    drawArc(length, 0, 2 * scale, 90, 180);
  };

  const drawTempAction = () => {
    if (!tempAction) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const action = actions.find(a => a.name === tempAction.action);
    if (!action) return;
    
    // Re-draw pitch and events first to ensure temp action is on top
    drawPitch(); 
    drawEvents();
    
    // Draw start point
    if (tempAction.startX && tempAction.startY) {
      ctx.fillStyle = action.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(tempAction.startX, tempAction.startY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(action.icon, tempAction.startX, tempAction.startY);
    }
    
    // Draw line and end point if end location exists
    if (tempAction.endX && tempAction.endY) {
      // Draw arrow line (dashed)
      ctx.strokeStyle = action.color;
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(tempAction.startX, tempAction.startY);
      ctx.lineTo(tempAction.endX, tempAction.endY);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash
      
      // Draw arrowhead
      const angle = Math.atan2(tempAction.endY - tempAction.startY, tempAction.endX - tempAction.startX);
      const arrowSize = 18;
      ctx.fillStyle = action.color;
      ctx.beginPath();
      ctx.moveTo(tempAction.endX, tempAction.endY);
      ctx.lineTo(
        tempAction.endX - arrowSize * Math.cos(angle - Math.PI / 6),
        tempAction.endY - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        tempAction.endX - arrowSize * Math.cos(angle + Math.PI / 6),
        tempAction.endY - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
      
      // Draw end point marker
      ctx.fillStyle = action.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(tempAction.endX, tempAction.endY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(action.icon, tempAction.endX, tempAction.endY);
    }
  };

  const drawEvents = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    events.forEach((event, index) => {
      const action = actions.find(a => a.name === event.action);
      if (!action) return;

      const finalColor = event.successful ? action.color : '#475569'; // slate-600 for failed
      
      // 1. Draw solid arrow from start to end
      ctx.strokeStyle = finalColor;
      ctx.lineWidth = 3;
      ctx.setLineDash([]); // Ensure line is solid
      ctx.beginPath();
      ctx.moveTo(event.startX, event.startY);
      ctx.lineTo(event.endX, event.endY);
      ctx.stroke();
      
      // 2. Draw arrowhead
      const angle = Math.atan2(event.endY - event.startY, event.endX - event.startX);
      const arrowSize = 15;
      ctx.fillStyle = finalColor;
      ctx.beginPath();
      ctx.moveTo(event.endX, event.endY);
      ctx.lineTo(
        event.endX - arrowSize * Math.cos(angle - Math.PI / 6),
        event.endY - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        event.endX - arrowSize * Math.cos(angle + Math.PI / 6),
        event.endY - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
      
      // 3. Draw start marker (numbered)
      ctx.fillStyle = finalColor;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(event.startX, event.startY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((index + 1).toString(), event.startX, event.startY);
      
      // 4. Draw result marker (✓ or ✗)
      ctx.fillStyle = finalColor;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(event.endX, event.endY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Inter';
      ctx.fillText(event.successful ? '✓' : '✗', event.endX, event.endY);
    });
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate scaling factor between display size and internal canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Check if click is within pitch boundaries (50px padding on all sides)
    if (x < 50 || x > 950 || y < 50 || y > 650) return;
    
    // Coordinate conversion to 120x80 yard pitch space
    const length = 900;
    const width = 600;
    const pitchX = ((x - 50) / length * 120).toFixed(2);
    const pitchY = ((y - 50) / width * 80).toFixed(2);
    
    if (currentStep === 'start_location') {
      setTempAction({
        ...tempAction,
        startX: x,
        startY: y,
        startPitchX: pitchX,
        startPitchY: pitchY
      });
      setCurrentStep('end_location');
    } else if (currentStep === 'end_location') {
      setTempAction({
        ...tempAction,
        endX: x,
        endY: y,
        endPitchX: pitchX,
        endPitchY: pitchY
      });
      setCurrentStep('success');
    }
  };

  const handleActionSelect = (actionName) => {
    setSelectedAction(actionName);
    setTempAction({
      action: actionName,
      timestamp: new Date().toLocaleTimeString()
    });
    setCurrentStep('start_location');
  };

  const handleSuccessChoice = (isSuccessful) => {
    const completedEvent = {
      ...tempAction,
      successful: isSuccessful,
      id: Date.now()
    };
    
    setEvents([...events, completedEvent]);
    
    // Reset for next action
    setTempAction(null);
    setSelectedAction(null);
    setCurrentStep('select_action');
  };

  const cancelAction = () => {
    setTempAction(null);
    setSelectedAction(null);
    setCurrentStep('select_action');
  };

  // Replace default browser alert with custom console log and return
  const clearAll = () => {
    console.log('User confirmed: Clearing all events.');
    setEvents([]);
  };

  const exportData = (format) => {
    if (format === 'json') {
      const dataStr = JSON.stringify(events, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'soccer_events.json';
      link.click();
    } else if (format === 'csv') {
      const headers = ['Event #', 'Action', 'Successful', 'Start X (Pitch)', 'Start Y (Pitch)', 'End X (Pitch)', 'End Y (Pitch)', 'Timestamp'];
      const rows = events.map((e, i) => [
        i + 1,
        e.action,
        e.successful ? 'Yes' : 'No',
        e.startPitchX,
        e.startPitchY,
        e.endPitchX,
        e.endPitchY,
        e.timestamp
      ]);
      
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'soccer_events.csv';
      link.click();
    }
  };

  const getStepInstruction = () => {
    switch(currentStep) {
      case 'select_action':
        return '1️⃣ Select an action to begin tagging.';
      case 'start_location':
        return `2️⃣ Click on the pitch to mark the START location for: ${selectedAction}`;
      case 'end_location':
        return `3️⃣ Click on the pitch to mark the END location for: ${selectedAction}`;
      case 'success':
        return `4️⃣ Final Step: Was the ${selectedAction} successful?`;
      default:
        return '';
    }
  };

  return (
    <div className="p-4 bg-gray-900 min-h-full">
      <div className="max-w-7xl mx-auto">
        {/* UPDATED: Tagger Header with Logo */}
        <div className="flex items-center gap-4 mb-6 hidden lg:flex">
          <img 
            src="/logo.png" 
            alt="FC360 Logo" 
            className="w-12 h-12 object-contain bg-white rounded-lg p-1" 
          />
          <h1 className="text-3xl font-bold text-white">Soccer Match Event Tagger</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Canvas Area & Controls */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-white mb-3">Action Workflow</h2>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {actions.map(action => (
                  <button
                    key={action.name}
                    onClick={() => handleActionSelect(action.name)}
                    disabled={currentStep !== 'select_action'}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all shadow-md ${
                      selectedAction === action.name
                        ? 'ring-4 ring-white scale-105'
                        : 'hover:scale-105'
                    } ${currentStep !== 'select_action' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ backgroundColor: action.color, color: 'white' }}
                  >
                    <span className="text-2xl mr-1">{action.icon}</span>
                    {action.name}
                  </button>
                ))}
              </div>
              
              {/* Step Instruction */}
              <div className="mt-4 p-3 bg-blue-900 rounded-lg">
                <p className="text-white font-semibold text-center">
                  {getStepInstruction()}
                </p>
              </div>
              
            </div>

            {/* Action Successful Buttons */}
            {currentStep === 'success' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">
                  Was the action successful?
                </h3>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => handleSuccessChoice(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors shadow-lg"
                  >
                    ✓ YES
                  </button>
                  <button
                    onClick={() => handleSuccessChoice(false)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors shadow-lg"
                  >
                    ✗ NO
                  </button>
                  <button
                    onClick={cancelAction}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <canvas 
                ref={canvasRef}
                onClick={handleCanvasClick}
                className={`w-full h-auto ${currentStep === 'start_location' || currentStep === 'end_location' ? 'cursor-crosshair' : 'cursor-default'}`}
                style={{ aspectRatio: '10 / 7' }}
              />
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Data Management</h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => clearAll()}
                  disabled={events.length === 0}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors flex items-center gap-1"
                >
                  <Trash2 className='w-4 h-4'/> Clear All ({events.length})
                </button>
                <button 
                  onClick={() => exportData('json')}
                  disabled={events.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors flex items-center gap-1"
                >
                  <FileDown className='w-4 h-4'/> Export JSON
                </button>
                <button 
                  onClick={() => exportData('csv')}
                  disabled={events.length === 0}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors flex items-center gap-1"
                >
                  <FileDown className='w-4 h-4'/> Export CSV
                </button>
                <button 
                  onClick={() => setShowData(!showData)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-1"
                >
                  {showData ? 'Hide Data' : 'Show Data'}
                </button>
              </div>
            </div>
          </div>

          {/* Event List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4 lg:sticky lg:top-4">
              <h2 className="text-xl font-semibold text-white mb-4">
                Events Log ({events.length})
              </h2>
              
              <div className="space-y-2 max-h-[70vh] lg:max-h-[80vh] overflow-y-auto pr-2">
                {events.length === 0 ? (
                  <p className="text-gray-400 text-sm">No events tagged yet. Start by selecting an action.</p>
                ) : (
                  events.slice().reverse().map((event, index) => { // Reverse to show latest first
                    const action = actions.find(a => a.name === event.action);
                    return (
                      <div 
                        key={event.id}
                        className="bg-gray-700 rounded p-3 text-white text-sm shadow-md border-l-4"
                        style={{ borderColor: event.successful ? action.color : '#475569' }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{events.length - index}. {event.action}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${event.successful ? 'bg-green-600' : 'bg-red-600'}`}>
                              {event.successful ? 'Success' : 'Failed'}
                            </span>
                          </div>
                          <button
                            onClick={() => setEvents(events.filter(e => e.id !== event.id))}
                            className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                          >
                            <Trash2 className='w-3 h-3'/> Delete
                          </button>
                        </div>
                        {showData && (
                          <div className="text-xs text-gray-300 space-y-1 mt-2 p-2 bg-gray-900 rounded">
                            <div className='font-mono'>Start: ({event.startPitchX}, {event.startPitchY}) yds</div>
                            <div className='font-mono'>End: ({event.endPitchX}, {event.endPitchY}) yds</div>
                            <div className='text-gray-500'>{event.timestamp}</div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component with Tab Navigation ---
const App = () => {
  // Change default active tab to 'analytics' since the profile viewer was replaced
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' or 'tagger'

  const TabButton = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-6 py-3 font-semibold transition-all text-lg rounded-t-xl flex items-center gap-2 ${
        activeTab === tabName
          ? 'bg-white text-indigo-700 shadow-t-lg'
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      }`}
    >
        {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-300">
          <TabButton tabName="analytics" label="FC360 Analytics" icon="📊" />
          <TabButton tabName="tagger" label="Match Tagger" icon="⚽" />
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl shadow-2xl min-h-[80vh]">
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'tagger' && <TaggerApp />}
        </div>
      </div>
    </div>
  );
};

export default App;