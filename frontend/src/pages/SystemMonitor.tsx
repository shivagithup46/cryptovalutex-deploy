import { Activity, Server, Database, HardDrive } from 'lucide-react';

export default function SystemMonitor() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-heading text-primary">System Monitoring</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glassmorphism rounded-2xl p-6 border border-white/10 text-center relative overflow-hidden">
                    <Activity className="mx-auto text-primary mb-3" size={32} />
                    <p className="text-secondary text-sm">CPU Usage</p>
                    <h3 className="text-3xl font-bold font-mono mt-1 text-primary">12.5%</h3>
                </div>
                <div className="glassmorphism rounded-2xl p-6 border border-white/10 text-center relative overflow-hidden">
                    <HardDrive className="mx-auto text-secondary mb-3" size={32} />
                    <p className="text-secondary text-sm">Memory Usage</p>
                    <h3 className="text-3xl font-bold font-mono mt-1 text-primary">45.2%</h3>
                </div>
                <div className="glassmorphism rounded-2xl p-6 border border-white/10 text-center relative overflow-hidden">
                    <Server className="mx-auto text-green-400 mb-3" size={32} />
                    <p className="text-secondary text-sm">API Latency</p>
                    <h3 className="text-3xl font-bold font-mono mt-1 text-primary">42ms</h3>
                </div>
                <div className="glassmorphism rounded-2xl p-6 border border-white/10 text-center relative overflow-hidden">
                    <Database className="mx-auto text-blue-400 mb-3" size={32} />
                    <p className="text-secondary text-sm">Active Connections</p>
                    <h3 className="text-3xl font-bold font-mono mt-1 text-primary">1,402</h3>
                </div>
            </div>

            <div className="glassmorphism rounded-2xl p-6 border border-white/10 mt-8">
                <h3 className="text-xl font-bold mb-4">Live Application Logs</h3>
                <div className="bg-black/60 rounded-xl p-4 font-mono text-sm h-64 overflow-y-auto border border-white/5 space-y-2">
                    <div className="text-secondary">[2026-10-15 14:32:01] <span className="text-blue-400">INFO</span> - Order matched successfully: BTCINR #4412</div>
                    <div className="text-secondary">[2026-10-15 14:32:05] <span className="text-blue-400">INFO</span> - JWT token validated for user ID: 90021</div>
                    <div className="text-secondary">[2026-10-15 14:32:12] <span className="text-yellow-400">WARN</span> - Rate limit approaching for IP 192.168.1.55</div>
                    <div className="text-secondary">[2026-10-15 14:32:15] <span className="text-blue-400">INFO</span> - New WebSocket connection established</div>
                    <div className="text-secondary">[2026-10-15 14:32:22] <span className="text-blue-400">INFO</span> - Database transaction committed (Latency: 8ms)</div>
                </div>
            </div>
        </div>
    );
}
