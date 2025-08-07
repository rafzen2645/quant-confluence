import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Pause, Clock, Target, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PredictionData {
  id?: string;
  direction: 'Buy' | 'Sell' | 'Wait';
  confidence: 'High' | 'Medium' | 'Low';
  riskLevel: 'Low' | 'Medium' | 'High';
  reason: string;
  timestamp: string;
}

interface PredictionResultProps {
  prediction: PredictionData | null;
  isAnalyzing: boolean;
}

export const PredictionResult = ({ prediction, isAnalyzing }: PredictionResultProps) => {
  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'Buy':
        return <TrendingUp className="w-6 h-6" />;
      case 'Sell':
        return <TrendingDown className="w-6 h-6" />;
      case 'Wait':
        return <Pause className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'Buy':
        return 'text-trading-bull';
      case 'Sell':
        return 'text-trading-bear';
      case 'Wait':
        return 'text-trading-neutral';
      default:
        return 'text-muted-foreground';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High':
        return 'bg-trading-bull/20 text-trading-bull border-trading-bull/30';
      case 'Medium':
        return 'bg-trading-warning/20 text-trading-warning border-trading-warning/30';
      case 'Low':
        return 'bg-trading-bear/20 text-trading-bear border-trading-bear/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-trading-bull/20 text-trading-bull border-trading-bull/30';
      case 'Medium':
        return 'bg-trading-warning/20 text-trading-warning border-trading-warning/30';
      case 'High':
        return 'bg-trading-bear/20 text-trading-bear border-trading-bear/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="bg-gradient-card border-border/50 shadow-trading">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-2xl font-bold">Analyzing Chart...</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Scanning patterns...</span>
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Checking confluences...</span>
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Calculating risk...</span>
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!prediction) {
    return (
      <Card className="bg-gradient-card border-border/50 shadow-trading">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Prediction Result
          </h2>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Upload a chart to get your prediction</p>
            <p className="text-sm mt-2">AI-powered analysis ready in &lt;15 seconds</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-border/50 shadow-trading animate-slide-up">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          Prediction Result
        </h2>

        <div className="space-y-6">
          {/* Main Prediction */}
          <div className="text-center">
            <div className={cn(
              "inline-flex items-center gap-3 px-6 py-4 rounded-lg border-2 text-2xl font-bold",
              prediction.direction === 'Buy' && "border-trading-bull/30 bg-trading-bull/10",
              prediction.direction === 'Sell' && "border-trading-bear/30 bg-trading-bear/10",
              prediction.direction === 'Wait' && "border-trading-neutral/30 bg-trading-neutral/10"
            )}>
              <span className={getDirectionColor(prediction.direction)}>
                {getDirectionIcon(prediction.direction)}
              </span>
              <span className={getDirectionColor(prediction.direction)}>
                {prediction.direction === 'Buy' ? '🔼 BUY' : 
                 prediction.direction === 'Sell' ? '🔽 SELL' : 
                 '⏸ WAIT'}
              </span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Confidence</label>
              <Badge className={cn("w-full justify-center py-2", getConfidenceColor(prediction.confidence))}>
                {prediction.confidence}
              </Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Risk Level</label>
              <Badge className={cn("w-full justify-center py-2", getRiskColor(prediction.riskLevel))}>
                {prediction.riskLevel}
              </Badge>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Analysis Reason
            </label>
            <div className="p-4 bg-accent/30 rounded-lg border border-accent">
              <p className="text-sm leading-relaxed">{prediction.reason}</p>
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-center text-xs text-muted-foreground">
            Generated at {prediction.timestamp}
          </div>

          {/* Martingale Note */}
          {prediction.direction !== 'Wait' && (
            <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-xs text-primary font-medium">
                📌 Remember: Apply 1-step Martingale (MTG) manually if needed
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};