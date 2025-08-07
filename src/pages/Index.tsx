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
      .limit(200);

    // Mock chart analysis - in real implementation, this would be AI vision analysis
    const chartFeatures = {
      pattern: ['engulfing', 'pin_bar', 'marubozu'][Math.floor(Math.random() * 3)],
      trend: ['uptrend', 'downtrend', 'sideways'][Math.floor(Math.random() * 3)],
      zone: ['support', 'resistance', 'order_block'][Math.floor(Math.random() * 3)],
      momentum: ['strong', 'weak', 'neutral'][Math.floor(Math.random() * 3)]
    };

    // Score each direction for this setup
    const directions: ('Buy' | 'Sell' | 'Wait')[] = ['Buy', 'Sell', 'Wait'];
    let bestScore = -Infinity;
    let bestPrediction: any = null;

    directions.forEach(direction => {
      // Find all historical predictions with same pattern+trend+direction
      const similar = (historicalPredictions || []).filter(p => {
        const features = p.chart_features as any;
        return features?.pattern === chartFeatures.pattern &&
               features?.trend === chartFeatures.trend &&
               p.direction === direction;
      });
      const total = similar.length;
      const winCount = similar.filter(s => s.outcome === 'Win').length;
      const lossCount = similar.filter(s => s.outcome === 'Loss').length;
      const winRate = total > 0 ? winCount / total : 0.5;
      const lossRate = total > 0 ? lossCount / total : 0.5;

      // If this direction is losing, try the opposite direction
      let adjustedDirection = direction;
      let adjustedScore = winRate - lossRate;
      if (direction !== 'Wait' && lossRate > 0.6 && total > 5) {
        // Try the opposite direction if this one is losing
        adjustedDirection = direction === 'Buy' ? 'Sell' : 'Buy';
        // Recalculate for the opposite direction
        const oppSimilar = (historicalPredictions || []).filter(p => {
          const features = p.chart_features as any;
          return features?.pattern === chartFeatures.pattern &&
                 features?.trend === chartFeatures.trend &&
                 p.direction === adjustedDirection;
        });
        const oppTotal = oppSimilar.length;
        const oppWinCount = oppSimilar.filter(s => s.outcome === 'Win').length;
        const oppLossCount = oppSimilar.filter(s => s.outcome === 'Loss').length;
        const oppWinRate = oppTotal > 0 ? oppWinCount / oppTotal : 0.5;
        const oppLossRate = oppTotal > 0 ? oppLossCount / oppTotal : 0.5;
        adjustedScore = oppWinRate - oppLossRate;
      }

      // Assign confidence/risk based on score
      let confidence: 'High' | 'Medium' | 'Low' = 'Medium';
      let riskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
      if (adjustedScore > 0.4) {
        confidence = 'High';
        riskLevel = 'Low';
      } else if (adjustedScore < -0.4) {
        confidence = 'Low';
        riskLevel = 'High';
      }

      // Reason string
      let reason = '';
      if (direction === 'Wait') {
        reason = 'Market in consolidation – no valid pattern or clean zone interaction.';
      } else if (direction !== adjustedDirection) {
        reason = `Historical feedback shows ${direction} is losing for this setup. Trying ${adjustedDirection} instead.`;
      } else {
        reason = `${adjustedDirection === 'Buy' ? 'Bullish' : 'Bearish'} ${chartFeatures.pattern} at ${chartFeatures.zone} with ${chartFeatures.momentum} momentum in ${chartFeatures.trend}.`;
      }

      // Score for Wait is always 0
      const finalScore = direction === 'Wait' ? 0 : adjustedScore;

      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestPrediction = {
          direction: adjustedDirection,
          confidence,
          riskLevel,
          reason,
          timestamp: new Date().toLocaleTimeString(),
          chartFeatures
        };
      }
    });

    // If all directions are bad, fallback to Wait
    if (!bestPrediction) {
      bestPrediction = {
        direction: 'Wait',
        confidence: 'Low',
        riskLevel: 'High',
        reason: 'No reliable prediction found for this setup.',
        timestamp: new Date().toLocaleTimeString(),
        chartFeatures
      };
    }
    
    // Store prediction in database

    const { data: savedPrediction, error } = await supabase
      .from('predictions')
      .insert({
        chart_features: bestPrediction.chartFeatures,
        direction: bestPrediction.direction,
        confidence: bestPrediction.confidence,
        risk_level: bestPrediction.riskLevel,
        reason: bestPrediction.reason
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving prediction:', error);
    }

    return {
      id: savedPrediction?.id,
      direction: bestPrediction.direction,
      confidence: bestPrediction.confidence,
      riskLevel: bestPrediction.riskLevel,
      reason: bestPrediction.reason,
      timestamp: bestPrediction.timestamp
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