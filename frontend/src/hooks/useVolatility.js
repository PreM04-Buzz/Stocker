export default function useVolatility(history) {
    if (!Array.isArray(history) || history.length < 5) return "—";
  
    const arr = history.slice(-20);
    let sum = 0;
  
    for (let i = 1; i < arr.length; i++) {
      sum += Math.abs(arr[i] - arr[i - 1]);
    }
  
    const avg = sum / Math.max(1, arr.length - 1);
  
    if (avg < 1) return "Low";
    if (avg < 2.5) return "Medium";
    return "High";
  }  