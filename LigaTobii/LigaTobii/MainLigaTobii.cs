using System;
using Tobii.Interaction;

namespace LigaTobii
{
    class Program
    {
        static void Main(string[] args)
        {
            bool cabecalho = true;
            string dir = @".\eye.txt";

            for (var i = 0; i < args.Length; i++)
            {
                if (args[i].Equals("-noheader"))
                {
                    cabecalho = false;
                }
                else if (args[i].Equals("-o"))
                {
                    dir = args[i + 1];
                }
            }

            System.IO.StreamWriter file = new System.IO.StreamWriter(dir);
            const int dist = 50;
            var host = new Host();
            var gazePointDataStream = host.Streams.CreateGazePointDataStream();
            var result = "";
            double oldX = 0;
            double oldY = 0;

            if (cabecalho)
                file.WriteLine("x\ty\tFixo\tTimestamp");


            gazePointDataStream.GazePoint((gazePointX, gazePointY, moment) =>
            {

                result = gazePointX.ToString("#.######").Replace(",", ".") + "\t" + gazePointY.ToString("#.######").Replace(",", ".") + "\t";

                if (Math.Sqrt(Math.Pow(oldX - gazePointX, 2) + Math.Pow(oldY - gazePointY, 2)) <= dist)
                {
                    result += "true\t";
                }
                else
                {
                    oldX = gazePointX;
                    oldY = gazePointY;
                    result += "false\t";
                }

                //host.Streams.CreateFixationDataStream().Data. + "\t" +
                result += DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff");
                file.WriteLine(result);
            });

            Console.Read();
        }
    }
}
