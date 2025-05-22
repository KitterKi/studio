
export default function SignInPage() {
  return (
    <div style={{ border: '3px solid blue', padding: '20px', backgroundColor: '#e6f7ff' }}>
      <h2 style={{color: 'blue', fontSize: '1.5em'}}>Sign In Page Content</h2>
      <p>If you see this, the sign-in page file itself is being reached.</p>
      <form>
        <div style={{margin: '10px 0'}}>
          <label htmlFor="email-dummy">Email:</label>
          <input type="email" id="email-dummy" name="email" defaultValue="test@example.com" />
        </div>
        <div style={{margin: '10px 0'}}>
          <label htmlFor="password-dummy">Password:</label>
          <input type="password" id="password-dummy" name="password" defaultValue="1234" />
        </div>
        <button type="submit" style={{padding: '5px 10px', marginTop: '10px'}}>Sign In (Dummy Button)</button>
      </form>
      <div style={{marginTop: '20px'}}>
        <a href="/" style={{color: 'green', marginRight: '10px'}}>Go to Home Page (/)</a>
        <a href="/community" style={{color: 'purple'}}>Go to Community Page</a>
      </div>
    </div>
  );
}
