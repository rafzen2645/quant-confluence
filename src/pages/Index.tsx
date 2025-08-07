import { useState } from "react";
import { Header } from "@/components/Header";
import { ChartUpload } from "@/components/ChartUpload";
import { PredictionResult, type PredictionData } from "@/components/PredictionResult";
import { useToast } from "@/hooks/use-toast";
import tradingHeroBg from "@/assets/trading-hero-bg.jpg";

const Index = () => {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // Mock AI analysis function - in a real app, this would call your AI service
  const mockAnalyzeChart = async (file: File): Promise<PredictionData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock prediction data - replace with actual AI analysis
    const predictions: PredictionData[] = [
      {
        direction: 'Buy',
        confidence: 'High',
        riskLevel: 'Low',
        reason: 'Bullish engulfing at trendline support with long rejection wick and clear uptrend continuation.',
        timestamp: new Date().toLocaleTimeString()
      },
      {
        direction: 'Sell',
        confidence: 'Medium',
        riskLevel: 'Medium',
        reason: 'Bearish pin bar at resistance zone with momentum divergence in downtrend context.',
        timestamp: new Date().toLocaleTimeString()
      },
      {
        direction: 'Wait',
        confidence: 'Low',
        riskLevel: 'High',
        reason: 'Market in consolidation – no valid pattern or clean zone interaction.',
        timestamp: new Date().toLocaleTimeString()
      }
    ];
    
    return predictions[Math.floor(Math.random() * predictions.length)];
  };

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      toast({
        title: "Analyzing Chart",
        description: "AI is processing your chart for prediction...",
      });

      const result = await mockAnalyzeChart(file);
      setPrediction(result);
      
      toast({
        title: "Analysis Complete",
        description: `Prediction: ${result.direction} | Confidence: ${result.confidence}`,
        variant: result.direction === 'Wait' ? 'destructive' : 'default',
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Please try uploading a clearer chart image.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-hero"
      style={{
        backgroundImage: `linear-gradient(rgba(34, 39, 46, 0.9), rgba(34, 39, 46, 0.95)), url(${tradingHeroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Header />
        
        <div className="grid lg:grid-cols-2 gap-8">
          <ChartUpload 
            onImageUpload={handleImageUpload}
            isAnalyzing={isAnalyzing}
          />
          
          <PredictionResult 
            prediction={prediction}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Disclaimer */}
        <div className="text-center text-xs text-muted-foreground max-w-4xl mx-auto">
          <p className="mb-2">
            ⚠️ <strong>Risk Disclaimer:</strong> Trading involves substantial risk of loss. This AI tool provides analysis for educational purposes only.
          </p>
          <p>
            Always use proper risk management, never trade more than you can afford to lose, and consider seeking advice from qualified financial advisors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;