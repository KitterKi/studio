
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ border: '3px solid red', padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
      <h1 style={{color: 'red', fontSize: '2em'}}>Auth Layout Boundary</h1>
      <div style={{ border: '2px solid orange', padding: '15px', marginTop: '10px', backgroundColor: 'white' }}>
        {children}
      </div>
    </div>
  );
}
