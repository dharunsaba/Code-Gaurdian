import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import CodeEditor from '@/components/CodeEditor';
import LanguageSelector from '@/components/LanguageSelector';
import { Code2, LogOut, Zap, Loader2, Copy, Check, User, AlertCircle, Terminal } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = 'http://127.0.0.1:8000';

// ... imports
import { Clock, ChevronRight } from 'lucide-react';

interface HistoryItem {
  id: number;
  code_snippet: string;
  optimized_code: string;
  flaw_report?: string;
  language: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');
  const [flawReport, setFlawReport] = useState('');
  const [includeCli, setIncludeCli] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fetchHistory = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`${API_BASE_URL}/history/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOptimize = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to optimize');
      return;
    }

    setIsLoading(true);
    setOptimizedCode('');
    setFlawReport('');

    try {
      const response = await fetch(`${API_BASE_URL}/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          code: code.trim(),
          include_cli: includeCli,
          user_id: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to optimize code');
      }

      const data = await response.json();
      setOptimizedCode(data.optimized_code || '');
      setFlawReport(data.flaw_report || '');
      toast.success('Code optimized successfully!');
      fetchHistory(); // Refresh history
    } catch (error) {
      console.error('Optimization error:', error);
      toast.error('Failed to optimize code. Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!optimizedCode) return;

    try {
      await navigator.clipboard.writeText(optimizedCode);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setCode(item.code_snippet);
    setOptimizedCode(item.optimized_code);
    setFlawReport(item.flaw_report || '');
    setLanguage(item.language);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen gradient-dark">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              Code<span className="text-gradient">Optimizer</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">{user?.username}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Optimize Your Code
            </h1>
            <p className="text-muted-foreground">
              Paste your code, select a language, and let AI enhance it for performance and readability
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 justify-between">
              <LanguageSelector value={language} onChange={setLanguage} />
              <Button
                variant="glow"
                size="lg"
                onClick={handleOptimize}
                disabled={isLoading || !code.trim()}
                className="min-w-[200px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Optimize Code
                  </>
                )}
              </Button>
            </div>

            {/* CLI Toggle */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
              <Terminal className="w-4 h-4 text-primary" />
              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={includeCli}
                  onChange={(e) => setIncludeCli(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Include command-line examples</span>
              </label>
            </div>
          </div>

          {/* Code Editors */}
          <div className="grid lg:grid-cols-2 gap-6">
            <CodeEditor
              value={code}
              onChange={setCode}
              label="Input Code"
              placeholder="Paste your code here..."
            />

            <div className="relative">
              <CodeEditor
                value={optimizedCode}
                label="Optimized Output"
                placeholder="Optimized code will appear here..."
                readOnly
              />
              {optimizedCode && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-12 right-4"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Flaw Report Card */}
          {flawReport && (
            <div className="p-3 rounded-none border-2 border-amber-500/20 space-y-1.5 bg-card">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <h3 className="text-xs font-semibold text-foreground">Flaw Report</h3>
              </div>
              <div className="text-xs text-muted-foreground whitespace-pre-wrap bg-secondary/50 p-2 rounded-none max-h-28 overflow-y-auto leading-relaxed border border-border">
                {flawReport}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-secondary border border-border">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  AI is analyzing and optimizing your code...
                </span>
              </div>
            </div>
          )}

          {/* History Section */}
          {history.length > 0 && (
            <div className="space-y-4 pt-8 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Recent History</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer group"
                    onClick={() => loadHistoryItem(item)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded bg-secondary text-secondary-foreground uppercase">
                        {item.language}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-3 font-mono bg-secondary/50 p-2 rounded">
                      {item.code_snippet}
                    </div>
                    <div className="mt-3 flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Load this optimization <ChevronRight className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
