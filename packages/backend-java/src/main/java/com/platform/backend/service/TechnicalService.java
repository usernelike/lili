package com.platform.backend.service;

import com.platform.backend.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TechnicalService {

    public TechnicalIndicators calculateIndicators(List<KLineData> kline) {
        if (kline == null || kline.size() < 60) return null;

        double[] closes = kline.stream().mapToDouble(KLineData::close).toArray();
        double[] highs = kline.stream().mapToDouble(KLineData::high).toArray();
        double[] lows = kline.stream().mapToDouble(KLineData::low).toArray();

        double[] ma5Arr = sma(closes, 5);
        double[] ma10Arr = sma(closes, 10);
        double[] ma20Arr = sma(closes, 20);
        double[] ma60Arr = sma(closes, 60);
        int last = closes.length - 1;

        MacdResult macd = calcMACD(closes);
        KdjResult kdj = calcKDJ(closes, highs, lows);
        RsiResult rsi = calcRSI(closes);
        BollResult boll = calcBOLL(closes);

        return new TechnicalIndicators(
            new TechnicalIndicators.Ma(round(ma5Arr[last]), round(ma10Arr[last]), round(ma20Arr[last]), round(ma60Arr[last])),
            new TechnicalIndicators.Macd(round(macd.dif[last]), round(macd.dea[last]), round(macd.macd[last])),
            new TechnicalIndicators.Kdj(round(kdj.k[last]), round(kdj.d[last]), round(kdj.j[last])),
            new TechnicalIndicators.Rsi(round(rsi.rsi6[last]), round(rsi.rsi12[last]), round(rsi.rsi24[last])),
            new TechnicalIndicators.Boll(round(boll.upper[last]), round(boll.middle[last]), round(boll.lower[last]))
        );
    }

    private double[] sma(double[] prices, int n) {
        double[] result = new double[prices.length];
        for (int i = 0; i < prices.length; i++) {
            if (i < n - 1) {
                result[i] = 0;
            } else {
                double sum = 0;
                for (int j = 0; j < n; j++) sum += prices[i - j];
                result[i] = sum / n;
            }
        }
        return result;
    }

    private double[] ema(double[] prices, int n) {
        double[] result = new double[prices.length];
        double k = 2.0 / (n + 1);
        for (int i = 0; i < prices.length; i++) {
            if (i == 0) {
                result[i] = prices[0];
            } else {
                result[i] = prices[i] * k + result[i - 1] * (1 - k);
            }
        }
        return result;
    }

    private MacdResult calcMACD(double[] prices) {
        double[] ema12 = ema(prices, 12);
        double[] ema26 = ema(prices, 26);
        double[] dif = new double[prices.length];
        for (int i = 0; i < prices.length; i++) dif[i] = ema12[i] - ema26[i];
        double[] dea = ema(dif, 9);
        double[] macd = new double[prices.length];
        for (int i = 0; i < prices.length; i++) macd[i] = (dif[i] - dea[i]) * 2;
        return new MacdResult(dif, dea, macd);
    }

    private KdjResult calcKDJ(double[] closes, double[] highs, double[] lows) {
        int n = 9, m1 = 3, m2 = 3;
        double[] k = new double[closes.length];
        double[] d = new double[closes.length];
        double[] j = new double[closes.length];
        for (int i = 0; i < closes.length; i++) {
            if (i < n - 1) {
                k[i] = 50; d[i] = 50; j[i] = 50;
                continue;
            }
            double lowN = lows[i];
            double highN = highs[i];
            for (int j2 = 1; j2 < n; j2++) {
                lowN = Math.min(lowN, lows[i - j2]);
                highN = Math.max(highN, highs[i - j2]);
            }
            double rsv = highN == lowN ? 50 : ((closes[i] - lowN) / (highN - lowN)) * 100;
            k[i] = (2.0 / 3) * (i > 0 ? k[i - 1] : 50) + (1.0 / 3) * rsv;
            d[i] = (2.0 / 3) * (i > 0 ? d[i - 1] : 50) + (1.0 / 3) * k[i];
            j[i] = 3 * k[i] - 2 * d[i];
        }
        return new KdjResult(k, d, j);
    }

    private RsiResult calcRSI(double[] prices) {
        int[] periods = {6, 12, 24};
        double[][] result = new double[3][prices.length];
        double[] changes = new double[prices.length - 1];
        for (int i = 1; i < prices.length; i++) changes[i - 1] = prices[i] - prices[i - 1];

        for (int pi = 0; pi < periods.length; pi++) {
            int period = periods[pi];
            for (int i = 0; i < prices.length; i++) {
                if (i < period) {
                    result[pi][i] = 0;
                    continue;
                }
                double gain = 0, loss = 0;
                for (int j = 0; j < period; j++) {
                    double change = (i - j - 2 >= 0) ? changes[i - j - 2] : 0;
                    if (change > 0) gain += change;
                    else loss += Math.abs(change);
                }
                double avgGain = gain / period;
                double avgLoss = loss / period;
                double rs = avgLoss == 0 ? 100 : avgGain / avgLoss;
                result[pi][i] = avgLoss == 0 ? 100 : 100 - 100 / (1 + rs);
            }
        }
        return new RsiResult(result[0], result[1], result[2]);
    }

    private BollResult calcBOLL(double[] prices) {
        int n = 20;
        double k = 2;
        double[] ma20 = sma(prices, n);
        double[] upper = new double[prices.length];
        double[] middle = new double[prices.length];
        double[] lower = new double[prices.length];
        for (int i = 0; i < prices.length; i++) {
            if (i < n - 1) {
                upper[i] = 0; middle[i] = 0; lower[i] = 0;
                continue;
            }
            double sumSq = 0;
            for (int j = 0; j < n; j++) {
                sumSq += Math.pow(prices[i - j] - ma20[i], 2);
            }
            double std = Math.sqrt(sumSq / n);
            upper[i] = ma20[i] + k * std;
            middle[i] = ma20[i];
            lower[i] = ma20[i] - k * std;
        }
        return new BollResult(upper, middle, lower);
    }

    private double round(double n) {
        return Math.round(n * 100) / 100.0;
    }

    private record MacdResult(double[] dif, double[] dea, double[] macd) {}
    private record KdjResult(double[] k, double[] d, double[] j) {}
    private record RsiResult(double[] rsi6, double[] rsi12, double[] rsi24) {}
    private record BollResult(double[] upper, double[] middle, double[] lower) {}
}
