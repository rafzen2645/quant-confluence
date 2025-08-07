import { useState } from "react";
import { Header } from "@/components/Header";
import { ChartUpload } from "@/components/ChartUpload";
import { PredictionResult, type PredictionData } from "@/components/PredictionResult";
import { PredictionHistory } from "@/components/PredictionHistory";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import tradingHeroBg from "@/assets/trading-hero-bg.jpg";

const Index = () => {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // Enhanced AI analysis with memory system
  const analyzeChartWithMemory = async (file: File): Promise<PredictionData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get historical data for learning
    const { data: historicalPredictions } = await supabase
      .from('predictions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    // Mock chart analysis - in real implementation, this would be AI vision analysis
    const chartFeatures = {
      pattern: ['engulfing', 'pin_bar', 'marubozu'][Math.floor(Math.random() * 3)],
      trend: ['uptrend', 'downtrend', 'sideways'][Math.floor(Math.random() * 3)],
      zone: ['support', 'resistance', 'order_block'][Math.floor(Math.random() * 3)],
      momentum: ['strong', 'weak', 'neutral'][Math.floor(Math.random() * 3)]
    };

    // Apply memory-based learning to adjust confidence and risk
    let baseConfidence: 'High' | 'Medium' | 'Low' = 'Medium';
    let baseRisk: 'Low' | 'Medium' | 'High' = 'Medium';
    
    if (historicalPredictions && historicalPredictions.length > 0) {
      // Analyze similar setups from history
      const similarSetups = historicalPredictions.filter(p => {
        const features = p.chart_features as any;
        return features?.pattern === chartFeatures.pattern &&
               features?.trend === chartFeatures.trend;
      });
      
      if (similarSetups.length > 0) {
        const winRate = similarSetups.filter(s => s.outcome === 'Win').length / similarSetups.length;
        
        // Adjust confidence based on historical performance
        if (winRate > 0.7) {
          baseConfidence = 'High';
          baseRisk = 'Low';
        } else if (winRate < 0.4) {
          baseConfidence = 'Low';
          baseRisk = 'High';
        }
      }
    }

    // Generate prediction based on confluences
    const predictions: (Omit<PredictionData, 'id'> & { chartFeatures: typeof chartFeatures })[] = [
      {
        direction: 'Buy',
        confidence: baseConfidence,
        riskLevel: baseRisk,
        reason: `Bullish ${chartFeatures.pattern} at ${chartFeatures.zone} with ${chartFeatures.momentum} momentum in ${chartFeatures.trend}.`,
        timestamp: new Date().toLocaleTimeString(),
        chartFeatures
      },
      {
        direction: 'Sell',
        confidence: baseConfidence,
        riskLevel: baseRisk,
        reason: `Bearish ${chartFeatures.pattern} at ${chartFeatures.zone} with ${chartFeatures.momentum} momentum in ${chartFeatures.trend}.`,
        timestamp: new Date().toLocaleTimeString(),
        chartFeatures
      },
      {
        direction: 'Wait',
        confidence: 'Low',
        riskLevel: 'High',
        reason: 'Market in consolidation – no valid pattern or clean zone interaction.',
        timestamp: new Date().toLocaleTimeString(),
        chartFeatures
      }
    ];
    
    const selectedPrediction = predictions[Math.floor(Math.random() * predictions.length)];
    
    // Store prediction in database
    const { data: savedPrediction, error } = await supabase
      .from('predictions')
      .insert({
        chart_features: selectedPrediction.chartFeatures,
        direction: selectedPrediction.direction,
        confidence: selectedPrediction.confidence,
        risk_level: selectedPrediction.riskLevel,
        reason: selectedPrediction.reason
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving prediction:', error);
    }

    return {
      id: savedPrediction?.id,
      direction: selectedPrediction.direction,
      confidence: selectedPrediction.confidence,
      riskLevel: selectedPrediction.riskLevel,
      reason: selectedPrediction.reason,
      timestamp: selectedPrediction.timestamp
    };
  };

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      toast({
        title: "Analyzing Chart",
        description: "AI is processing your chart for prediction...",
      });

      const result = await analyzeChartWithMemory(file);
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
          
          <div className="space-y-6">
            <PredictionResult 
              prediction={prediction}
              isAnalyzing={isAnalyzing}
            />
            
            <PredictionHistory currentPrediction={prediction} />
          </div>
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