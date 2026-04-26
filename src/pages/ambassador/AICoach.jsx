import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import AmbassadorNav from '../../components/AmbassadorNav';
import { getLevelFromPoints, getLevelProgress } from '../../utils/gameEngine';
import novaAvatar from '../../assets/nova-avatar.png';

const F = "'Plus Jakarta Sans', sans-serif";

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
);
const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93H2c0 4.97 3.57 9.13 8.25 9.87V21h3.5v-3.13C18.43 17.13 22 12.97 22 8h-2c0 4.08-3.06 7.44-7 7.93V15h-2v.93z"/></svg>
);
const MicOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.34 3 3 3 .23 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/></svg>
);
const SpeakerIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
);

const NovaAvatar = ({ isSpeaking, isListening, isThinking, isDark }) => {
  const [breathe, setBreathe] = useState(false);
  useEffect(() => {
    const i = setInterval(() => setBreathe(p => !p), 2500);
    return () => clearInterval(i);
  }, []);

  const ringColor = isSpeaking ? 'rgba(167,139,250,0.6)' : isListening ? 'rgba(99,102,241,0.6)' : 'rgba(124,58,237,0.25)';

  return (
    <div style={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
      {(isSpeaking || isListening) && (
        <>
          <div style={{ position:'absolute', inset:-20, borderRadius:'50%', border:`2px solid ${ringColor}`, animation:'ringPulse 1.4s ease-out infinite' }}/>
          <div style={{ position:'absolute', inset:-36, borderRadius:'50%', border:`1px solid ${ringColor}`, animation:'ringPulse 1.4s ease-out infinite 0.5s' }}/>
        </>
      )}
      {isThinking && (
        <div style={{ position:'absolute', inset:-10, borderRadius:'50%', background:'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)', animation:'thinkGlow 1.2s ease-in-out infinite alternate' }}/>
      )}
      <div style={{ position:'absolute', inset:-6, borderRadius:'50%', background:'conic-gradient(from 0deg, #4F46E5, #7C3AED, #A78BFA, #4F46E5)', animation:'spinRing 8s linear infinite', padding:3 }}>
        <div style={{ width:'100%', height:'100%', borderRadius:'50%', background: isDark ? '#13112B' : '#F5F3FF' }}/>
      </div>
      <div style={{ position:'absolute', inset:-2, borderRadius:'50%', boxShadow:`0 0 ${isSpeaking?40:isThinking?20:16}px ${isSpeaking?'rgba(167,139,250,0.7)':isThinking?'rgba(251,191,36,0.4)':'rgba(124,58,237,0.35)'}`, transition:'box-shadow 0.4s ease' }}/>
      <div style={{ width:200, height:200, borderRadius:'50%', overflow:'hidden', position:'relative', zIndex:1, transform:`scale(${breathe?1.015:1})`, transition:'transform 2.5s ease-in-out', border:`3px solid ${isDark?'#2A2550':'#EDE9FE'}` }}>
        <img src={novaAvatar} alt="Nova AI Coach" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', filter: isSpeaking ? 'brightness(1.05) saturate(1.1)' : isThinking ? 'brightness(0.95) saturate(0.9)' : 'brightness(1)', transition:'filter 0.4s ease' }}/>
        {isSpeaking && <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(167,139,250,0.08) 0%, transparent 60%)', animation:'shimmer 1.5s ease-in-out infinite alternate' }}/>}
      </div>
      {[{top:'5%',left:'-8%',size:6,color:'#A78BFA',dur:3},{top:'80%',left:'-5%',size:4,color:'#818CF8',dur:2.5},{top:'10%',right:'-8%',size:5,color:'#C4B5FD',dur:3.5},{top:'70%',right:'-6%',size:7,color:'#7C3AED',dur:2.8},{top:'45%',left:'-12%',size:3,color:'#FCD34D',dur:4}].map((dot,i) => (
        <div key={i} style={{ position:'absolute', top:dot.top, left:dot.left, right:dot.right, width:dot.size, height:dot.size, borderRadius:'50%', background:dot.color, opacity:0.7, animation:`floatDot ${dot.dur}s ease-in-out infinite alternate`, animationDelay:`${i*0.4}s` }}/>
      ))}
      <style>{`
        @keyframes ringPulse { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(1.25);opacity:0} }
        @keyframes spinRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes thinkGlow { from{opacity:0.5;transform:scale(0.95)} to{opacity:1;transform:scale(1.05)} }
        @keyframes shimmer { from{opacity:0.4} to{opacity:0.9} }
        @keyframes floatDot { from{transform:translateY(0px);opacity:0.5} to{transform:translateY(-10px);opacity:1} }
      `}</style>
    </div>
  );
};

const SoundBars = ({ active, color = '#A78BFA' }) => (
  <div style={{ display:'flex', alignItems:'center', gap:3, height:28 }}>
    {[0.35,0.65,1,0.75,0.5,0.85,0.55,0.9,0.4].map((h,i) => (
      <div key={i} style={{ width:3, borderRadius:2, background:`linear-gradient(180deg,${color},${color}88)`, height:active?`${h*100}%`:'15%', animation:active?`barAnim 0.${4+i}s ease-in-out infinite alternate`:'none', animationDelay:`${i*0.08}s`, transition:'height 0.3s ease' }}/>
    ))}
    <style>{`@keyframes barAnim{from{transform:scaleY(0.3)}to{transform:scaleY(1)}}`}</style>
  </div>
);

const MessageBubble = ({ msg, isDark, onSpeak }) => {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display:'flex', justifyContent:isUser?'flex-end':'flex-start', marginBottom:14, animation:'msgIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
      {!isUser && (
        <div style={{ width:30, height:30, borderRadius:'50%', flexShrink:0, marginRight:8, marginTop:2, overflow:'hidden', border:'2px solid rgba(124,58,237,0.4)' }}>
          <img src={novaAvatar} alt="Nova" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }}/>
        </div>
      )}
      <div style={{ maxWidth:'72%', padding:'11px 15px', borderRadius:isUser?'18px 18px 4px 18px':'18px 18px 18px 4px', background:isUser?'linear-gradient(135deg,#4F46E5,#7C3AED)':isDark?'rgba(30,26,62,0.95)':'rgba(249,247,255,0.98)', border:isUser?'none':`1px solid ${isDark?'rgba(124,111,208,0.25)':'rgba(167,139,250,0.3)'}`, boxShadow:isUser?'0 4px 18px rgba(79,70,229,0.3)':'0 2px 10px rgba(0,0,0,0.07)', color:isUser?'white':isDark?'#E8E0FF':'#1E1B4B', fontSize:13.5, lineHeight:1.7, fontFamily:F }}>
        {msg.content}
        {!isUser && (
          <button onClick={()=>onSpeak(msg.content)} style={{ display:'flex', alignItems:'center', gap:4, marginTop:6, padding:0, background:'none', border:'none', cursor:'pointer', color:isDark?'#7C6FD0':'#A78BFA', fontSize:11, fontWeight:700, fontFamily:F }}>
            <SpeakerIcon/> Replay voice
          </button>
        )}
      </div>
      <style>{`@keyframes msgIn{from{opacity:0;transform:translateY(10px) scale(0.95)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
};

const SUGGESTIONS = ["How can I boost my XP fast?","What tasks should I prioritize?","Tips to climb the leaderboard?","How do I unlock my next badge?","What is the best streak strategy?"];

export default function AICoach() {
  const { user } = useAuth();
  const { getCurrentAmbassador } = useData();
  const liveAmb = getCurrentAmbassador?.(user?.id) ?? user ?? {};

  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [isThinking, setIsThinking]   = useState(false);
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDark] = useState(() => localStorage.getItem('astraliq-theme') === 'dark');

  const bottomRef      = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef       = useRef(window.speechSynthesis);
  const inputRef       = useRef(null);

  const level    = getLevelFromPoints(liveAmb.points ?? 0);
  const progress = getLevelProgress(liveAmb.points ?? 0);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, isThinking]);

  useEffect(() => {
    const name = user?.name?.split(' ')[0] ?? 'there';
    setMessages([{ role:'assistant', content:`Hey ${name}! I am Nova, your personal AstralIQ coach. You are at ${level.name} level with ${liveAmb.points ?? 0} XP. I am here to help you level up, crush tasks, and dominate the leaderboard. What is on your mind?` }]);
  }, []);

  const systemPrompt = () => `You are Nova, a warm, sharp, and motivating AI Coach for AstralIQ — a gamified campus ambassador platform.
Ambassador: ${liveAmb.name ?? user?.name}, Level: ${level.name}, XP: ${liveAmb.points ?? 0}, Tasks Done: ${liveAmb.tasksCompleted ?? 0}, Streak: ${liveAmb.streak ?? 0} days, Badges: ${(liveAmb.badges??[]).join(', ')||'none'}, Progress: ${progress}%.
Be warm, direct, specific, concise (2-4 sentences). Use their name occasionally. No emojis.`;

  const callMistral = async (userMessage) => {
    const key = import.meta.env.VITE_MISTRAL_API_KEY;
    const history = messages.map(m => ({ role:m.role, content:m.content }));
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${key}` },
      body: JSON.stringify({ model:'mistral-large-latest', messages:[{ role:'system', content:systemPrompt() }, ...history, { role:'user', content:userMessage }], max_tokens:300, temperature:0.72 }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? 'I had a hiccup — please try again!';
  };

  const handleSend = async (override) => {
    const text = (override ?? input).trim();
    if (!text || isThinking) return;
    setInput('');
    setMessages(prev => [...prev, { role:'user', content:text }]);
    setIsThinking(true);
    try {
      const reply = await callMistral(text);
      setMessages(prev => [...prev, { role:'assistant', content:reply }]);
      speakText(reply);
    } catch {
      setMessages(prev => [...prev, { role:'assistant', content:'Connection issue — check your Mistral API key.' }]);
    } finally {
      setIsThinking(false);
    }
  };

  const speakText = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.93; utt.pitch = 1.12;
    const voices = synthRef.current.getVoices();
    const female = voices.find(v => ['samantha','victoria','karen','moira','fiona','zira','susan','catherine'].some(n => v.name.toLowerCase().includes(n)))
      ?? voices.find(v => v.lang === 'en-US') ?? voices[0];
    if (female) utt.voice = female;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend   = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    synthRef.current.speak(utt);
  };

  const toggleListen = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) { alert('Voice input requires Chrome or Edge.'); return; }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 1;
    rec.onresult = (e) => { setInput(e.results[0][0].transcript); setIsListening(false); inputRef.current?.focus(); };
    rec.onerror = () => setIsListening(false);
    rec.onend   = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start(); setIsListening(true);
  };

  const t = {
    bg: isDark?'#0D0B1E':'#F8F7FF', panel: isDark?'#13112B':'#FFFFFF',
    border: isDark?'#2A2550':'#EDE9FE', text: isDark?'#E8E0FF':'#1E1B4B',
    subtext: isDark?'#7C6FD0':'#8B5CF6', inputBg: isDark?'#1E1A3E':'#F5F3FF',
    inputBorder: isDark?'#3D3570':'#DDD6FE', cardBg: isDark?'rgba(30,26,62,0.7)':'rgba(255,255,255,0.8)',
  };

  const statusLabel = isThinking?'Thinking...':isSpeaking?'Speaking...':isListening?'Listening...':'Online';
  const statusColor = isThinking?'#FBBF24':isSpeaking?'#10B981':isListening?'#6366F1':'#22C55E';

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:t.bg, fontFamily:F }}>
      <AmbassadorNav />
      <main style={{ marginLeft:220, flex:1, display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden' }}>

        {/* Header */}
        <div style={{ padding:'18px 32px', borderBottom:`1px solid ${t.border}`, background:t.panel, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <h1 style={{ margin:0, fontSize:19, fontWeight:900, color:t.text, fontFamily:F }}>AI Coach</h1>
            <p style={{ margin:'2px 0 0', fontSize:12, color:t.subtext, fontFamily:F }}>Nova — your personal AstralIQ mentor</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:20, background:isDark?'rgba(79,70,229,0.12)':'rgba(79,70,229,0.07)', border:`1px solid ${isDark?'rgba(124,111,208,0.3)':'rgba(167,139,250,0.4)'}` }}>
            <StarIcon/>
            <span style={{ fontSize:11, fontWeight:800, color:t.subtext, fontFamily:F }}>{level.name} · {liveAmb.points??0} XP</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

          {/* Left — Nova */}
          <div style={{ width:272, flexShrink:0, borderRight:`1px solid ${t.border}`, display:'flex', flexDirection:'column', alignItems:'center', padding:'32px 20px 24px', background:isDark?'linear-gradient(180deg,#13112B,#0D0B1E)':'linear-gradient(180deg,#F5F3FF,#EDE9FE 80%)', overflowY:'auto' }}>
            <NovaAvatar isSpeaking={isSpeaking} isListening={isListening} isThinking={isThinking} isDark={isDark}/>

            <div style={{ marginTop:20, textAlign:'center', width:'100%' }}>
              <p style={{ margin:0, fontSize:18, fontWeight:900, color:t.text, fontFamily:F }}>Nova</p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginTop:5 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:statusColor, boxShadow:`0 0 8px ${statusColor}`, transition:'background 0.3s, box-shadow 0.3s' }}/>
                <span style={{ fontSize:12, fontWeight:700, color:t.subtext, fontFamily:F }}>{statusLabel}</span>
              </div>
              {(isSpeaking||isListening) && (
                <div style={{ display:'flex', justifyContent:'center', marginTop:10 }}>
                  <SoundBars active={isSpeaking||isListening} color={isListening?'#6366F1':'#A78BFA'}/>
                </div>
              )}
            </div>

            <div style={{ width:'100%', height:1, background:t.border, margin:'20px 0' }}/>

            <div style={{ width:'100%', padding:'14px 16px', borderRadius:16, background:t.cardBg, border:`1px solid ${t.border}` }}>
              <p style={{ margin:'0 0 12px', fontSize:9, fontWeight:900, color:t.subtext, textTransform:'uppercase', letterSpacing:'0.15em', fontFamily:F }}>Your Stats</p>
              {[{label:'Level',value:level.name},{label:'Total XP',value:(liveAmb.points??0).toLocaleString()},{label:'Tasks Done',value:liveAmb.tasksCompleted??0},{label:'Day Streak',value:`${liveAmb.streak??0} days`},{label:'Badges',value:(liveAmb.badges??[]).length}].map(s => (
                <div key={s.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <span style={{ fontSize:12, color:t.subtext, fontFamily:F }}>{s.label}</span>
                  <span style={{ fontSize:12, fontWeight:800, color:t.text, fontFamily:F }}>{s.value}</span>
                </div>
              ))}
              <div style={{ marginTop:10, height:5, borderRadius:99, background:t.inputBg }}>
                <div style={{ height:5, borderRadius:99, width:`${progress}%`, background:'linear-gradient(90deg,#4F46E5,#7C3AED)', boxShadow:'0 0 6px rgba(79,70,229,0.5)', transition:'width 0.5s ease' }}/>
              </div>
              <p style={{ margin:'5px 0 0', fontSize:10, color:t.subtext, fontFamily:F }}>{progress}% to next level</p>
            </div>
          </div>

          {/* Right — Chat */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
            <div style={{ flex:1, overflowY:'auto', padding:'24px 28px', display:'flex', flexDirection:'column' }}>

              {messages.length <= 1 && (
                <div style={{ marginBottom:22 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:t.subtext, marginBottom:10, fontFamily:F }}>Try asking:</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {SUGGESTIONS.map(s => (
                      <button key={s} onClick={()=>handleSend(s)} style={{ padding:'7px 14px', borderRadius:20, cursor:'pointer', border:`1px solid ${isDark?'rgba(124,111,208,0.4)':'rgba(167,139,250,0.5)'}`, background:isDark?'rgba(79,70,229,0.12)':'rgba(79,70,229,0.06)', color:t.subtext, fontSize:12, fontWeight:600, fontFamily:F, transition:'all 0.2s' }}
                        onMouseEnter={e=>{e.currentTarget.style.background='rgba(79,70,229,0.2)';e.currentTarget.style.color=t.text}}
                        onMouseLeave={e=>{e.currentTarget.style.background=isDark?'rgba(79,70,229,0.12)':'rgba(79,70,229,0.06)';e.currentTarget.style.color=t.subtext}}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg,i) => <MessageBubble key={i} msg={msg} isDark={isDark} onSpeak={speakText}/>)}

              {isThinking && (
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <div style={{ width:30, height:30, borderRadius:'50%', overflow:'hidden', flexShrink:0, border:'2px solid rgba(124,58,237,0.4)' }}>
                    <img src={novaAvatar} alt="Nova" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }}/>
                  </div>
                  <div style={{ padding:'11px 16px', borderRadius:'18px 18px 18px 4px', background:isDark?'rgba(30,26,62,0.95)':'rgba(249,247,255,0.98)', border:`1px solid ${isDark?'rgba(124,111,208,0.25)':'rgba(167,139,250,0.3)'}`, display:'flex', gap:5, alignItems:'center' }}>
                    {[0,1,2].map(i=><div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#A78BFA', animation:'dotBounce 1s ease infinite', animationDelay:`${i*0.18}s` }}/>)}
                  </div>
                </div>
              )}

              <div ref={bottomRef}/>
              <style>{`@keyframes dotBounce{0%,80%,100%{transform:scale(0.5);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
            </div>

            {/* Input */}
            <div style={{ padding:'14px 24px 18px', borderTop:`1px solid ${t.border}`, background:t.panel, flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 8px 8px 18px', borderRadius:28, background:t.inputBg, border:`1.5px solid ${t.inputBorder}`, boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
                <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&handleSend()} placeholder="Ask Nova anything..." style={{ flex:1, background:'none', border:'none', outline:'none', fontSize:13.5, color:t.text, fontFamily:F }}/>
                <button onClick={toggleListen} style={{ width:38, height:38, borderRadius:'50%', border:'none', cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:isListening?'linear-gradient(135deg,#EF4444,#DC2626)':isDark?'rgba(124,111,208,0.18)':'rgba(167,139,250,0.18)', color:isListening?'white':t.subtext, transition:'all 0.2s' }}>
                  {isListening?<MicOffIcon/>:<MicIcon/>}
                </button>
                <button onClick={()=>handleSend()} disabled={!input.trim()||isThinking} style={{ width:38, height:38, borderRadius:'50%', border:'none', cursor:input.trim()&&!isThinking?'pointer':'default', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:input.trim()&&!isThinking?'linear-gradient(135deg,#4F46E5,#7C3AED)':isDark?'rgba(60,55,100,0.35)':'rgba(200,195,240,0.4)', color:input.trim()&&!isThinking?'white':t.subtext, boxShadow:input.trim()&&!isThinking?'0 4px 14px rgba(79,70,229,0.4)':'none', transition:'all 0.2s' }}>
                  <SendIcon/>
                </button>
              </div>
              <p style={{ margin:'8px 0 0', fontSize:10.5, color:t.subtext, textAlign:'center', fontFamily:F }}>Powered by Mistral AI · Nova knows your full AstralIQ journey</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}