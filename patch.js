const fs = require('fs');
const file = 'artifacts/clinic-platform/src/pages/AdminDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "  const [, setLocation] = useLocation();",
  "  const [location, setLocation] = useLocation();"
);

code = code.replace(
  "  >('dashboard');",
  "  >(() => {\n    const pathParts = location.split('/');\n    const lastPart = pathParts[pathParts.length - 1];\n    const validTabs = ['dashboard', 'calendar', 'appointments', 'patients', 'services', 'ai-settings', 'settings', 'billing', 'profile'];\n    return validTabs.includes(lastPart) ? (lastPart as any) : 'dashboard';\n  });"
);

code = code.replace(
  "  const refreshAdminData = async () => {",
  "  // Sync tab changes to URL\n  useEffect(() => {\n    if (location !== `/app/${activeTab}`) {\n      setLocation(`/app/${activeTab}`);\n    }\n  }, [activeTab]);\n\n  const refreshAdminData = async () => {"
);

fs.writeFileSync(file, code);
