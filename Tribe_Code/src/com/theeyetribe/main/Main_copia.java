package com.theeyetribe.main;

import com.theeyetribe.clientsdk.GazeManager;
import com.theeyetribe.clientsdk.IGazeListener;
import com.theeyetribe.clientsdk.data.GazeData;
import com.theeyetribe.clientsdk.data.Point2D;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Scanner;

import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author LabVIS_Mestrado
 */
public class Main_copia {

    static File arq = new File("teste.txt");

    static FileReader fr;

    static PrintWriter resultado;

    static StringBuffer pt = new StringBuffer();

    static FileWriter fw;

    static BufferedWriter escrever;

    static BufferedReader abrirArq;

    public static void main(String[] args) throws FileNotFoundException, IOException {

        System.out.println("Argumentos:  " + Arrays.toString(args));

        String header = "X\tY\tFixo\tTimestamp";
        String webcamname = "Integrated Webcam";
        String screenname = "screen-capture-recorder";
        String framerate = "20";
        String outdir = "";
        String outname = "teste";
        String microphonename = "Microfone (Realtek High Definition Audio)";

        boolean hasheader = true;
        boolean storeWebcam = true;
        boolean storeScreen = true;
        boolean storeEyetracker = true;
        boolean appendMode = false;

        for (int i = 0; i < args.length; i++) {
            if (args[i].toLowerCase().equals("-oname")) {
                outname = args[i + 1];
                File f = new File(outdir + File.separator + outname + ".txt");
                f.createNewFile();
                if (f.isFile()) {
                    arq = f;
                    System.out.println("Output file: " + arq.getAbsolutePath());
                }
            } else if (args[i].toLowerCase().equals("-noheader")) {
                hasheader = false;
            } else if (args[i].toLowerCase().equals("-noscreen")) {
                storeScreen = false;
            } else if (args[i].toLowerCase().equals("-nowebcam")) {
                storeWebcam = false;
            } else if (args[i].toLowerCase().equals("-noeyetracker")) {
                storeEyetracker = false;
            } else if (args[i].toLowerCase().equals("-webcamname")) {
                webcamname = args[i + 1];
            } else if (args[i].toLowerCase().equals("-screenname")) {
                screenname = args[i + 1];
            } else if (args[i].toLowerCase().equals("-microphonename")) {
                microphonename = args[i + 1];
            } else if (args[i].toLowerCase().equals("-framerate")) {
                framerate = args[i + 1];
            } else if (args[i].toLowerCase().equals("-append")) {
                appendMode = true;
            } else if (args[i].toLowerCase().equals("-dir")) {
                File f = new File(args[i + 1]);
                System.out.println("Tentativa: " + f.getAbsolutePath());
                if (f.isDirectory()) {
                    outdir = f.getAbsolutePath();
                    System.out.println("Output dir: " + outdir);
                }
            }

        }

        try {
            fw = new FileWriter(arq.getAbsolutePath(), appendMode);

            escrever = new BufferedWriter(fw);

            resultado = new PrintWriter(escrever);

            if (hasheader) {
                resultado.println(header);
            }
        } catch (IOException ex) {
            Logger.getLogger(Main_copia.class.getName()).log(Level.SEVERE, null, ex);
        }

        OutputStream out1 = null, out2 = null;
        if (storeWebcam) {
            System.out.println("Running: ffmpeg -framerate " + framerate + " -f dshow -i video=\"" + webcamname + "\":audio=\"" + microphonename + "\" \"" + outdir + File.separator + outname + "_webcam.mp4\"");
            Process p1 = Runtime.getRuntime().exec("ffmpeg -framerate " + framerate + " -f dshow -i video=\"" + webcamname + "\":audio=\"" + microphonename + "\" \"" + outdir + File.separator + outname + "_webcam.mp4\"");
            out1 = p1.getOutputStream();
            System.out.println("WebCam isAlive? "+p1.isAlive());
        }
        
        if (storeScreen) {
            System.out.println("Running: ffmpeg -framerate " + framerate + " -f dshow -i video=\"" + screenname + "\" \"" + outdir + File.separator + outname + "_screen.mp4\"");
            Process p2 = Runtime.getRuntime().exec("ffmpeg -framerate " + framerate + " -f dshow -i video=\"" + screenname + "\" \"" + outdir + File.separator + outname + "_screen.mp4\"");
            out2 = p2.getOutputStream();
            System.out.println("Screen recorder isAlive? "+p2.isAlive());
            
        }

        GazeManager gm = null;
        if (storeEyetracker) {
            gm = GazeManager.getInstance(); // Instancia Servidor

            System.out.println(gm.activate() ? "Eye Tracker Ativo!" : "Erro: EyeTracker desconectado. Conecte o EyeTribe e ligue o servidor."); //Servidor Ativo?

            System.out.println(gm.getVersion()); // vrsão da API

            mostrarPosicaoOlhos gz = new mostrarPosicaoOlhos();

            gm.addGazeListener(gz);
        }

        Scanner s = new Scanner(System.in);
        String str = s.next();

        if (out1 != null) {
            out1.write("q".getBytes());
            out1.flush();
        }

        if (out2 != null) {
            out2.write("q".getBytes());
            out2.flush();
        }

        resultado.close();
        if (storeEyetracker && gm != null && gm.isActivated()) {
            gm.deactivate();
        }

        System.out.println("exited");

    }

    //Clasee de atualização
    public static class mostrarPosicaoOlhos implements IGazeListener {

        @Override
        public void onGazeUpdate(GazeData gazeData) {

            try {

                fr = new FileReader(arq);

            } catch (FileNotFoundException ex) {
                Logger.getLogger(Main_copia.class.getName()).log(Level.SEVERE, null, ex);
            }

            Point2D ponto = gazeData.rawCoordinates; // estimativa dos dois olhos mágicos.
            Boolean fixo = gazeData.isFixated;
            String tempo = gazeData.timeStampString;

//            System.out.println(ponto + "\t" + fixo + "\t" + tempo + "\n"); //Mostrar ponto
//            escrever = new BufferedWriter(fw);
            resultado.println(ponto.x + "\t" + ponto.y + "\t" + fixo + "\t" + tempo);
            resultado.flush();

        }

    }
}
