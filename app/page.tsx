'use client';

import React, { useState, useEffect } from 'interface' in globalThis ? {} : { useState, useEffect };

interface UserLog {
  id: string;
  phone: string;
  salary: number;
  currentBalance: number;
  age: number;
  gender: string;
  createdAt: string;
}

export default function Home() {
  const [salary, setSalary] = useState<number | ''>('');
  const [currentBalance, setCurrentBalance] = useState<number | ''>('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [retireAge, setRetireAge] = useState<number>(67);
  const [customCoefficient, setCustomCoefficient] = useState<number | ''>('');
  const [phone, setPhone] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'simulator' | 'guide'>('simulator');
  
  // ניהול מנהל
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);
  const [adminSubTab, setAdminSubTab] = useState<'logs' | 'whitelist'>('logs');

  // רשימת טלפונים לבנים (פטורים ולא נספרים)
  const [whitelistPhones, setWhitelistPhones] = useState<string[]>(['0500000000']);
  const [newWhitePhone, setNewWhitePhone] = useState('');

  // מעקב האם המשתמש טען נתוני דוגמה (כדי לא לספור אותם)
  const [isDemoLoaded, setIsDemoLoaded] = useState(false);

  // שדות עמלות וחשיפה למניות במסך הראשי
  const [depositFee, setDepositFee] = useState<number | ''>('');
  const [accumulationFee, setAccumulationFee] = useState<number | ''>('');
  const [equityExposure, setEquityExposure] = useState<number | ''>('');

  // שדות אינטראקטיביים בתוך הסימולטור (לעדכן קצבה וחיסכון בזמן אמת)
  const [simDepositFee, setSimDepositFee] = useState<number | ''>('');
  const [simAccumulationFee, setSimAccumulationFee] = useState<number | ''>('');
  const [simEquityExposure, setSimEquityExposure] = useState<number | ''>('');
  const [copied, setCopied] = useState(false);

  const providers = [
    { name: 'מנורה מבטחים' },
    { name: 'הראל ביטוח ופנסיה' },
    { name: 'מגדל מקפת' },
    { name: 'כלל ביטוח ופנסיה' },
    { name: 'הפניקס' },
    { name: 'אלטשולר שחם' },
    { name: 'מיטב דש' },
  ];

  useEffect(() => {
    setRetireAge(gender === 'male' ? 67 : 65);
  }, [gender]);

  useEffect(() => {
    const savedLogs = localStorage.getItem('clearpensia_user_logs');
    if (savedLogs) {
      try {
        setUserLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error('Error parsing logs', e);
      }
    }

    const savedWhitelist = localStorage.getItem('clearpensia_whitelist');
    if (savedWhitelist) {
      try {
        setWhitelistPhones(JSON.parse(savedWhitelist));
      } catch (e) {
        console.error('Error parsing whitelist', e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setSimDepositFee(depositFee);
    setSimAccumulationFee(accumulationFee);
    setSimEquityExposure(equityExposure);

    const trimmedPhone = phone.trim();
    const isWhitelisted = whitelistPhones.includes(trimmedPhone);

    if (!isDemoLoaded && !isWhitelisted) {
      const newLog: UserLog = {
        id: Date.now().toString(),
        phone: trimmedPhone,
        salary: Number(salary) || 0,
        currentBalance: Number(currentBalance) || 0,
        age: Number(age) || 0,
        gender: gender === 'male' ? 'גבר' : 'אישה',
        createdAt: new Date().toLocaleString('he-IL'),
      };

      const updatedLogs = [newLog, ...userLogs];
      setUserLogs(updatedLogs);
      localStorage.setItem('clearpensia_user_logs', JSON.stringify(updatedLogs));
    }

    setIsSubmitted(true);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '123456') {
      setIsAdminLoggedIn(true);
    } else {
      alert('סיסמה שגויה');
    }
  };

  const handleAddWhitePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhitePhone.trim()) return;
    if (whitelistPhones.includes(newWhitePhone.trim())) {
      alert('המספר כבר קיים ברשימה');
      return;
    }
    const updatedList = [...whitelistPhones, newWhitePhone.trim()];
    setWhitelistPhones(updatedList);
    localStorage.setItem('clearpensia_whitelist', JSON.stringify(updatedList));
    setNewWhitePhone('');
  };

  const handleRemoveWhitePhone = (phoneToRemove: string) => {
    const updatedList = whitelistPhones.filter(p => p !== phoneToRemove);
    setWhitelistPhones(updatedList);
    localStorage.setItem('clearpensia_whitelist', JSON.stringify(updatedList));
  };

  const handleResetLogs = () => {
    if (window.confirm('האם אתה בטוח שברצונך לאפס ולמחוק את כל דוח הכניסות?')) {
      setUserLogs([]);
      localStorage.removeItem('clearpensia_user_logs');
    }
  };

  const handleResetToStart = () => {
    setIsSubmitted(false);
    setIsDemoLoaded(false);
  };

  const loadExampleData = () => {
    setDepositFee(0.0);
    setAccumulationFee(0.056);
    setEquityExposure(35);
    setSalary(368);
    setCurrentBalance(964409);
    setAge(66);
    setCustomCoefficient(104.4);
    setPhone('0501234567');
    setSelectedProvider('מגדל מקפת');
    setIsDemoLoaded(true);
  };

  const monthlySalary = Number(salary) || 0;
  const initialBalance = Number(currentBalance) || 0;
  const currentAge = Number(age) || 30;
  const targetRetireAge = Number(retireAge) || (gender === 'male' ? 67 : 65);
  const yearsToRetire = Math.max(1, targetRetireAge - currentAge);
  
  const effectiveCoefficient = Number(customCoefficient) > 0 
    ? Number(customCoefficient) 
    : (targetRetireAge >= 67 ? 190 : 200);

  const activeDepositFee = simDepositFee === '' ? 0 : Number(simDepositFee);
  const activeAccumulationFee = simAccumulationFee === '' ? 0 : Number(simAccumulationFee);
  const activeEquity = simEquityExposure === '' ? 35 : Number(simEquityExposure);

  const baseReturn = 0.035 + (activeEquity / 100) * 0.035;
  const netReturn = baseReturn - (activeAccumulationFee / 100);
  const netDepositFactor = 1 - (activeDepositFee / 100);
  
  const futureValueExisting = initialBalance * Math.pow(1 + netReturn, yearsToRetire);
  const futureValueDeposits = monthlySalary * 12 * 0.20 * netDepositFactor * ((Math.pow(1 + netReturn, yearsToRetire) - 1) / netReturn);

  const estimatedSavings = Math.round(futureValueExisting + futureValueDeposits);
  const estimatedMonthlyPension = Math.round(estimatedSavings / effectiveCoefficient);

  const calculateScenario = (annualReturn: number) => {
    const netRet = annualReturn - (activeAccumulationFee / 100);
    const netDepFactor = 1 - (activeDepositFee / 100);
    const fvBalance = initialBalance * Math.pow(1 + netRet, yearsToRetire);
    const fvDeposits = monthlySalary * 12 * 0.20 * netDepFactor * ((Math.pow(1 + netRet, yearsToRetire) - 1) / netRet);
    return Math.round(fvBalance + fvDeposits);
  };

  const scenarioPessimistic = calculateScenario(0.035);
  const scenarioModerate = calculateScenario(0.055);
  const scenarioOptimistic = calculateScenario(0.080);

  const pensionPessimistic = Math.round(scenarioPessimistic / effectiveCoefficient);
  const pensionModerate = Math.round(scenarioModerate / effectiveCoefficient);
  const pensionOptimistic = Math.round(scenarioOptimistic / effectiveCoefficient);

  const origDepositFee = depositFee === '' ? 0 : Number(depositFee);
  const origAccumulationFee = accumulationFee === '' ? 0 : Number(accumulationFee);

  const currentFeesCost = (monthlySalary * 12 * 0.20 * (origDepositFee / 100)) + (initialBalance * (origAccumulationFee / 100));
  const newFeesCost = (monthlySalary * 12 * 0.20 * (activeDepositFee / 100)) + (initialBalance * (activeAccumulationFee / 100));
  const yearlySavings = Math.max(0, Math.round(currentFeesCost - newFeesCost));

  const negotiationLetter = `לכבוד מחלקת שירות הלקוחות, ${selectedProvider || 'חברת הביטוח/הפנסיה'}

הנדון: בקשה לעדכון והוזלת דמי ניהול בקרן הפנסיה

אני חוסך/ת בקרן הפנסיה שלכם, ועל פי הנתונים שברשותי דמי הניהול הנגבים ממני כיום עומדים על ${origDepositFee}% מהפקדה ו-${origAccumulationFee}% מצבירה.

לאחר בדיקת הצעות מקבילות בשוק ונתוני הייחוס, ברצוני לבקש התאמה של דמי הניהול לתנאים הבאים:
- דמי ניהול מהפקדה: ${activeDepositFee}%
- דמי ניהול מצבירה: ${activeAccumulationFee}%

במידה ולא מתאפשר לעדכן את התנאים לשיעור זה, אאלץ לבחון את העברת החיסכון לקרן פנסיה חלופית המציעה תנאים אלו.

אשמח למענה ולעדכון הטופס בהקדם.
בתודה,
מספר טלפון ליצירת קשר: ${phone}`;

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(negotiationLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', direction: 'rtl', maxWidth: '800px', margin: '0 auto', color: '#1a202c', background: '#f4f6f9', minHeight: '100vh' }}>
      
      {/* כותרת עליונה */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem', 
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)',
        padding: '1.5rem 2rem', 
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        borderBottom: '3px solid #3182ce'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '2.8rem', fontWeight: 'bold', color: '#63b3ed', fontFamily: 'serif', letterSpacing: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            𝓡𝓢
          </span>
          <div>
            <h1 style={{ margin: 0, color: '#ffffff', fontSize: '1.8rem', fontWeight: '900', letterSpacing: '0.5px' }}>מהיום אתה מחליט על בגובה הפנסיה</h1>
            <p style={{ margin: '0.3rem 0 0 0', fontSize: '1.1rem', color: '#63b3ed', fontWeight: '700' }}>POWER-PENSIA</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {isSubmitted && !isAdminLoggedIn && (
            <button 
              onClick={handleResetToStart}
              style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', backdropFilter: 'blur(5px)' }}
            >
              🏠 חישוב חדש
            </button>
          )}

          {!isAdminLoggedIn ? (
            <form onSubmit={handleAdminLogin} style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="password"
                placeholder="סיסמת מנהל"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #4a5568', width: '90px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.9)' }}
              />
              <button type="submit" style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: '#3182ce', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>כניסה</button>
            </form>
          ) : (
            <button onClick={() => setIsAdminLoggedIn(false)} style={{ padding: '0.5rem 1rem', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>יציאה מאדמין</button>
          )}
        </div>
      </header>

      {/* רצועת המבצע העליונה */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
        color: '#ffffff',
        padding: '14px 24px',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        margin: '0 0 1.5rem 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        direction: 'rtl'
      }}>
        <span>מבצע!!!! לדרזיים שביניכם חינם עד 1.12.26</span>
      </div>

      {/* מדריך מורחב בכניסה לדף */}
      <div style={{ 
        background: '#fff', 
        padding: '1.5rem', 
        borderRadius: '10px', 
        marginBottom: '1.5rem', 
        border: '1px solid #cbd5e0', 
        boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem'
      }}>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1a365d', fontSize: '1.1rem' }}>📌 מדריך למשתמש: איפה מוצאים את הנתונים וכיצד הם משפיעים על הפנסיה?</h3>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#4a5568', lineHeight: '1.6' }}>
            מערכת זו נועדה לאפשר לכל חוסך לבצע בקרה וניהול עצמאי של קרן הפנסיה שלו מול הגופים המוסדיים. להלן ההסבר המלא כיצד לאסוף את הנתונים ומה המשמעות של כל פרמטר.
          </p>
        </div>

        {/* איפה מוצאים את הנתונים */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#2b6cb0', fontSize: '1rem' }}>🔍 איפה מוצאים את הנתונים בחברה שבה אתה נמצא?</h4>
          <ol style={{ margin: 0, paddingRight: '1.2rem', fontSize: '0.9rem', color: '#2d3748', display: 'flex', flexDirection: 'column', gap: '0.4rem', lineHeight: '1.5' }}>
            <li><strong>התחברות לאזור האישי:</strong> היכנס לאתר או לאפליקציה של חברת הביטוח או בית ההשקעות המנהל את הקרן שלך (למשל: מגדל, הראל, מנורה, כלל, אלטשולר שחם וכדומה).</li>
            <li><strong>דו"ח שנתי / תקופתי:</strong> חפש את הדו"ח השנתי האחרון או את "תעודת הזהות הפנסיונית" המופיעה בעמוד הבית באזור האישי.</li>
            <li><strong>המסקלה הפנסיונית:</strong> ניתן להפיק ריכוז נתונים חינמי או מרוכז דרך אתר המסלקה הפנסיונית של משרד האוצר.</li>
          </ol>
          <div style={{ marginTop: '0.8rem', textAlign: 'center' }}>
            <a 
              href="mailto:support@clearpensia.com?subject=עזרה במציאת נתונים פנסיוניים" 
              style={{ display: 'inline-block', background: '#3182ce', color: 'white', padding: '0.4rem 1rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}
            >
              מתלבט או לא מסתדר? שלח אלינו מייל לעזרה בחינם
            </a>
          </div>
        </div>

        {/* משמעות השדות ודוגמת שינוי לכל פרמטר */}
        <div>
          <h4 style={{ margin: '0 0 0.6rem 0', color: '#1a365d', fontSize: '1rem' }}>📊 משמעות כל שדה, השפעתו על הפנסיה, ודוגמת שינוי:</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
            
            <div style={{ background: '#fffaf0', border: '1px solid #feebc8', padding: '0.8rem', borderRadius: '8px' }}>
              <strong style={{ color: '#c05621' }}>1. דמי ניהול מהפקדה:</strong>
              <p style={{ margin: '0.3rem 0', color: '#4a5568' }}>נגבים מדי חודש כאחוז מתוך ההפקדה השוטפת (לדוגמה מהשכר או מההפרשות).</p>
              <p style={{ margin: 0, color: '#2d3748', fontSize: '0.85rem' }}>
                💡 <strong>דוגמת שינוי והשפעה:</strong> הורדת דמי הניהול מהפקדה מ-<strong>2%</strong> ל-<strong>0%</strong> (חיסכון של 2%) על הפקדה חודשית של 1,000 ₪ חוסכת לך מאות שפות בשנה ומצטברת לאלפי שקלים שנוספים ישירות לחיסכון שלך לפרישה.
              </p>
            </div>

            <div style={{ background: '#f0fff4', border: '1px solid #c6f6d5', padding: '0.8rem', borderRadius: '8px' }}>
              <strong style={{ color: '#276749' }}>2. דמי ניהול מצבירה:</strong>
              <p style={{ margin: '0.3rem 0', color: '#4a5568' }}>נגבים מדי חודש מסך כל החיסכון המצטבר בקרן (הסכום הגדול שנצבר לאורך השנים).</p>
              <p style={{ margin: 0, color: '#2d3748', fontSize: '0.85rem' }}>
                💡 <strong>דוגמת שינוי והשפעה:</strong> זהו הפרמטר הקריטי ביותר! הורדת דמי הניהול מצבירה מ-<strong>0.22%</strong> (המקסימום בחוק) ל-<strong>0.05%</strong> על צבירה של 1,000,000 ₪ יכולה לחסוך לך כ-<strong>1,700 ₪ נטו בשנה</strong> רק בדמי ניהול, סכום שגדל באופן אקספוננציאלי לאורך השנים בזכות אפקט ריבית דריבית.
              </p>
            </div>

            <div style={{ background: '#ebf8ff', border: '1px solid #bee3f8', padding: '0.8rem', borderRadius: '8px' }}>
              <strong style={{ color: '#2b6cb0' }}>3. חשיפה למניות (מסלול השקעה):</strong>
              <p style={{ margin: '0.3rem 0', color: '#4a5568' }}>קובע איזה נתח מהכסף שלך מושקע בשוק המניות לעומת אג"ח ותשואה מובטחת.</p>
              <p style={{ margin: 0, color: '#2d3748', fontSize: '0.85rem' }}>
                💡 <strong>דוגמת שינוי והשפעה:</strong> העלאת החשיפה למניות מ-<strong>30%</strong> ל-<strong>60%</strong> עשויה להעלות את התשואה הממוצעת לאורך זמן (למשל מ-4% ל-6%), מה שמעלה את הקצבה החודשית העתידית בפרישה בעשרות אחוזים (מאות או אלפי שקלים בחודש יותר בקצבה).
              </p>
            </div>

          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', background: '#fff5f5', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #fed7d7' }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <span style={{ fontSize: '0.9rem', color: '#9b2c2c', fontWeight: '700', lineHeight: '1.5' }}>
            הצהרה חשובה: מערכת זו אינה מהווה ייעוץ פנסיוני או שיווק השקעות כחוק. מדובר בכלי סימולציה ובקרה עצמאי בלבד.
          </span>
        </div>
      </div>

      {isAdminLoggedIn ? (
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #cbd5e0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ color: '#2b6cb0', margin: 0 }}>⚙️ ניהול מערכת אדמין</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setAdminSubTab('logs')}
                style={{ padding: '0.4rem 0.8rem', background: adminSubTab === 'logs' ? '#3182ce' : '#edf2f7', color: adminSubTab === 'logs' ? '#fff' : '#2d3748', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                📊 דוח כניסות ({userLogs.length})
              </button>
              <button
                onClick={() => setAdminSubTab('whitelist')}
                style={{ padding: '0.4rem 0.8rem', background: adminSubTab === 'whitelist' ? '#3182ce' : '#edf2f7', color: adminSubTab === 'whitelist' ? '#fff' : '#2d3748', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🛡️ טלפונים פטורים ({whitelistPhones.length})
              </button>
            </div>
          </div>

          {adminSubTab === 'logs' ? (
            <div>
              {userLogs.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <button
                    onClick={() => setIsAdminLoggedIn(false)}
                    style={{ padding: '0.4rem 0.8rem', background: '#718096', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                  >
                    ⬅️ חזרה למסך הקודם
                  </button>
                  <button
                    onClick={handleResetLogs}
                    style={{ padding: '0.4rem 0.8rem', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                  >
                    🔄 איפוס דוח כניסות
                  </button>
                </div>
              )}

              {userLogs.length === 0 ? (
                <div>
                  <button
                    onClick={() => setIsAdminLoggedIn(false)}
                    style={{ padding: '0.4rem 0.8rem', background: '#718096', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem' }}
                  >
                    ⬅️ חזרה למסך הקודם
                  </button>
                  <p style={{ fontStyle: 'italic', color: '#a0aec0' }}>טרם נרשמו כניסות ידניות למערכת.</p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '1rem', background: '#ebf8ff', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #bee3f8', fontWeight: 'bold', color: '#2b6cb0' }}>
                    סך הכל כניסות ידניות של לקוחות (לא כולל בדיקות סימולטור ונתוני דוגמה): {userLogs.length}
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#edf2f7', textAlign: 'right' }}>
                        <th style={{ padding: '0.6rem', border: '1px solid #cbd5e0' }}>זמן כניסה</th>
                        <th style={{ padding: '0.6rem', border: '1px solid #cbd5e0' }}>טלפון (מזהה)</th>
                        <th style={{ padding: '0.6rem', border: '1px solid #cbd5e0' }}>שכר</th>
                        <th style={{ padding: '0.6rem', border: '1px solid #cbd5e0' }}>צבירה קיימת</th>
                        <th style={{ padding: '0.6rem', border: '1px solid #cbd5e0' }}>גיל</th>
                        <th style={{ padding: '0.6rem', border: '1px solid #cbd5e0' }}>מין</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userLogs.map((log) => (
                        <tr key={log.id}>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0' }}>{log.createdAt}</td>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0', fontWeight: 'bold' }}>{log.phone}</td>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0' }}>₪{log.salary.toLocaleString()}</td>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0' }}>₪{(log.currentBalance || 0).toLocaleString()}</td>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0' }}>{log.age}</td>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0' }}>{log.gender}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          ) : (
            <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '8px', border: '1px solid #cbd5e0' }}>
              <button
                onClick={() => setIsAdminLoggedIn(false)}
                style={{ padding: '0.4rem 0.8rem', background: '#718096', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem' }}
              >
                ⬅️ חזרה למסך הקודם
              </button>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2b6cb0' }}>ניהול מספרים פטורים (Whitelist)</h3>
              <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '1rem' }}>
                מספרים אלו יוכלו להיכנס באופן חופשי, **ולא יוצגו או ייספרו** בדוח הכניסות.
              </p>

              <form onSubmit={handleAddWhitePhone} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input
                  type="tel"
                  placeholder="הכנס מספר טלפון (לדוגמה: 0501234567)"
                  value={newWhitePhone}
                  onChange={(e) => setNewWhitePhone(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                />
                <button type="submit" style={{ padding: '0.5rem 1rem', background: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  הוסף לרשימה
                </button>
              </form>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {whitelistPhones.map((p) => (
                  <li key={p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#edf2f7', padding: '0.5rem 0.8rem', borderRadius: '6px', border: '1px solid #cbd5e0' }}>
                    <span style={{ fontWeight: 'bold', direction: 'ltr' }}>{p}</span>
                    <button 
                      onClick={() => handleRemoveWhitePhone(p)}
                      style={{ background: '#e53e3e', color: '#fff', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      הסר
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <main>
          {!isSubmitted ? (
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: '#2d3748', margin: 0, fontSize: '1.3rem' }}>הזנת פרטים לחישוב פנסיוני</h2>
                <button
                  type="button"
                  onClick={loadExampleData}
                  style={{ padding: '0.5rem 0.9rem', background: '#ebf8ff', color: '#2b6cb0', border: '1px solid #bee3f8', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                >
                  ⚡ טען נתוני דוגמה (מקפת)
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                
                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>טלפון נייד (שם משתמש למעקב): </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="050-0000000"
                    required
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fdfdfe' }}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>חברה מנהלת / קרן פנסיה: </label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fdfdfe' }}
                  >
                    <option value="">-- בחר חברה (אופציונלי) --</option>
                    {providers.map((p) => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>סכום צבירה נוכחי בקרן (₪): </label>
                  <input
                    type="number"
                    value={currentBalance}
                    onChange={(e) => {
                      setCurrentBalance(e.target.value === '' ? '' : Number(e.target.value));
                      setIsDemoLoaded(false);
                    }}
                    placeholder="לדוגמה: 964409"
                    required
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fdfdfe' }}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>מין: </label>
                  <select
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value as 'male' | 'female');
                      setIsDemoLoaded(false);
                    }}
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fdfdfe' }}
                  >
                    <option value="male">גבר (גיל פרישה תקני 67)</option>
                    <option value="female">אישה (גיל פרישה תקני 65)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>הפקדה חודשית שוטפת (₪): </label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => {
                      setSalary(e.target.value === '' ? '' : Number(e.target.value));
                      setIsDemoLoaded(false);
                    }}
                    placeholder="לדוגמה: 368"
                    required
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fdfdfe' }}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>גיל נוכחי: </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value === '' ? '' : Number(e.target.value));
                      setIsDemoLoaded(false);
                    }}
                    placeholder="לדוגמה: 66"
                    required
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fdfdfe' }}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>גיל פרישה מתוכנן: </label>
                  <input
                    type="number"
                    min={Number(age) || 30}
                    max={80}
                    value={retireAge}
                    onChange={(e) => setRetireAge(e.target.value === '' ? 67 : Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fdfdfe' }}
                  />
                </div>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <h4 style={{ margin: '0 0 0.2rem 0', color: '#2b6cb0', fontSize: '0.95rem' }}>✍️ עמלות ומסלול (הקלדה ידנית):</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>דמי ניהול הפקדה (%):</label>
                      <input
                        type="number"
                        step="0.001"
                        value={depositFee}
                        onChange={(e) => setDepositFee(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0.0"
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fff' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>דמי ניהול צבירה (%):</label>
                      <input
                        type="number"
                        step="0.001"
                        value={accumulationFee}
                        onChange={(e) => setAccumulationFee(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0.056"
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fff' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>חשיפה למניות (%):</label>
                      <input
                        type="number"
                        value={equityExposure}
                        onChange={(e) => setEquityExposure(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="35"
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fff' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f0fff4', padding: '0.8rem', borderRadius: '8px', border: '1px solid #c6f6d5' }}>
                  <label style={{ fontWeight: 'bold', color: '#276749', fontSize: '0.9rem' }}>מקדם המרה מותאם (למשל 104.4): </label>
                  <input
                    type="number"
                    step="0.1"
                    value={customCoefficient}
                    onChange={(e) => setCustomCoefficient(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="לדוגמה: 104.4"
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fff' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '0.9rem',
                    backgroundColor: '#2b6cb0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    marginTop: '0.5rem',
                    boxShadow: '0 4px 10px rgba(43, 108, 176, 0.3)',
                    transition: 'background 0.2s'
                  }}
                >
                  מעבר לסימולטור השוואה וניתוח
                </button>
              </form>
            </div>
          ) : (
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #cbd5e0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setActiveTab('simulator')}
                    style={{
                      padding: '0.6rem 1.2rem',
                      background: activeTab === 'simulator' ? '#2b6cb0' : '#edf2f7',
                      color: activeTab === 'simulator' ? '#fff' : '#2d3748',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    🎛️ סימולטור אינטראקטיבי
                  </button>
                  <button
                    onClick={() => setActiveTab('guide')}
                    style={{
                      padding: '0.6rem 1.2rem',
                      background: activeTab === 'guide' ? '#2b6cb0' : '#edf2f7',
                      color: activeTab === 'guide' ? '#fff' : '#2d3748',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    📄 מכתב למסלקה / חברה
                  </button>
                </div>
                
                <button
                  onClick={handleResetToStart}
                  style={{ padding: '0.5rem 1rem', background: '#718096', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                >
                  🔄 ערוך נתונים מחדש
                </button>
              </div>

              {activeTab === 'simulator' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* סיכום תוצאות מרכזי */}
                  <div style={{ background: 'linear-gradient(135deg, #ebf8ff 0%, #eef2f7 100%)', padding: '1.5rem', borderRadius: '10px', border: '1px solid #bee3f8', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.9rem', color: '#4a5568', fontWeight: 'bold' }}>צבירה חזויה בפרישה:</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#2b6cb0', marginTop: '0.3rem' }}>₪{estimatedSavings.toLocaleString()}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.9rem', color: '#4a5568', fontWeight: 'bold' }}>קצבה חודשית משוערת:</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#276749', marginTop: '0.3rem' }}>₪{estimatedMonthlyPension.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* בקרה אינטראקטיבית בזמן אמת */}
                  <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '10px', border: '1px solid #cbd5e0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#2d3748' }}>🎛️ שחק עם הנתונים ובדוק השפעה בזמן אמת:</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>דמי ניהול הפקדה (%):</label>
                        <input
                          type="number"
                          step="0.001"
                          value={simDepositFee}
                          onChange={(e) => setSimDepositFee(e.target.value === '' ? '' : Number(e.target.value))}
                          style={{ width: '100%', padding: '0.4rem', marginTop: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>דמי ניהול צבירה (%):</label>
                        <input
                          type="number"
                          step="0.001"
                          value={simAccumulationFee}
                          onChange={(e) => setSimAccumulationFee(e.target.value === '' ? '' : Number(e.target.value))}
                          style={{ width: '100%', padding: '0.4rem', marginTop: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>חשיפה למניות (%):</label>
                        <input
                          type="number"
                          value={simEquityExposure}
                          onChange={(e) => setSimEquityExposure(e.target.value === '' ? '' : Number(e.target.value))}
                          style={{ width: '100%', padding: '0.4rem', marginTop: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                        />
                      </div>
                    </div>

                    {yearlySavings > 0 && (
                      <div style={{ background: '#e6fffa', padding: '0.8rem', borderRadius: '6px', border: '1px solid #b2f5ea', color: '#234e52', fontSize: '0.9rem', fontWeight: 'bold', textAlign: 'center' }}>
                        💡 חיסכון שנתי כתוצאה מהוזלת דמי ניהול: ₪{yearlySavings.toLocaleString()} בשנה!
                      </div>
                    )}
                  </div>

                  {/* טבלת תרחישי תשואה */}
                  <div>
                    <h3 style={{ fontSize: '1rem', color: '#2d3748', marginBottom: '0.8rem' }}>📈 תרחישי תשואה שונים עד הפרישה:</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'center' }}>
                      <thead>
                        <tr style={{ background: '#edf2f7' }}>
                          <th style={{ padding: '0.6rem', border: '1px solid #cbd5e0' }}>תרחיש</th>
                          <th style={{ padding: '0.6rem', border: '1px solid #cbd5e0' }}>תשואה שנתית</th>
                          <th style={{ padding: '0.6rem', border: '1px solid #cbd5e0' }}>צבירה חזויה</th>
                          <th style={{ padding: '0.6rem', border: '1px solid #cbd5e0' }}>קצבה חודשית</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0', fontWeight: 'bold', color: '#c53030' }}>שמרני</td>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0' }}>3.5%</td>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0' }}>₪{scenarioPessimistic.toLocaleString()}</td>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0', fontWeight: 'bold' }}>₪{pensionPessimistic.toLocaleString()}</td>
                        </tr>
                        <tr style={{ background: '#f8fafc' }}>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0', fontWeight: 'bold', color: '#2b6cb0' }}>בינוני (ריאלי)</td>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0' }}>5.5%</td>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0' }}>₪{scenarioModerate.toLocaleString()}</td>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0', fontWeight: 'bold' }}>₪{pensionModerate.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0', fontWeight: 'bold', color: '#276749' }}>אופטימי</td>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0' }}>8.0%</td>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0' }}>₪{scenarioOptimistic.toLocaleString()}</td>
                          <td style={{ padding: '0.5rem', border: '1px solid #cbd5e0', fontWeight: 'bold' }}>₪{pensionOptimistic.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ margin: 0, color: '#2d3748', fontSize: '1.1rem' }}>📄 טיוטת מכתב מוכנה למשלוח לחברה המנהלת / מסלקה:</h3>
                  <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>
                    העתק את הנוסח הבא ושלח אותו לחברה המנהלת שלך כדי לדרוש דמי ניהול מופחתים בהתאם לסימולציה:
                  </p>
                  
                  <textarea
                    readOnly
                    value={negotiationLetter}
                    rows={12}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e0', background: '#f8fafc', fontFamily: 'monospace', fontSize: '0.85rem', direction: 'rtl' }}
                  />

                  <button
                    onClick={handleCopyLetter}
                    style={{
                      padding: '0.8rem',
                      background: copied ? '#38a169' : '#3182ce',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      transition: 'background 0.2s'
                    }}
                  >
                    {copied ? '✅ הטקסט הועתק בהצלחה ללוח!' : '📋 העתק טיוטת מכתב ללוח'}
                  </button>
                </div>
              )}

            </div>
          )}
        </main>
      )}
    </div>
  );
}
