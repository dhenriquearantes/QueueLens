import Sidebar from "@/components/Sidebar";

const Home = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Home</h1>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Home;
