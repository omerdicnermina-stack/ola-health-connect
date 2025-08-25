import olaHealthLogo from '@/assets/ola-health-logo.png';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <img 
          src={olaHealthLogo} 
          alt="OLA Health" 
          className="h-16 w-auto mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
      </div>
    </div>
  );
};

export default Index;
