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
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.GregorianCalendar;
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

    static  BufferedWriter escrever;
    
    static BufferedReader abrirArq;
    
    public static void main(String[] args) throws FileNotFoundException, IOException {


        if(args.length > 0){
            File f = new File(args[0]);
            f.createNewFile();
            if(f.isFile()){
                arq = f;
                System.out.println(arq.getAbsolutePath());
            }
        }

        try {
            fw = new FileWriter(arq.getAbsolutePath(), args.length > 1 && args[1].equals("true"));
            
            escrever = new BufferedWriter(fw);

            resultado = new PrintWriter(escrever);
            
        } catch (IOException ex) {
            Logger.getLogger(Main_copia.class.getName()).log(Level.SEVERE, null, ex);
        }
        

        
        GazeManager gm = GazeManager.getInstance(); // Instancia Servidor
        
        System.out.println(gm.activate()); //Servidor Ativo?

        System.out.println(gm.getVersion()); // vrsão da API
        
        mostrarPosicaoOlhinho gz = new mostrarPosicaoOlhinho();

        gm.addGazeListener(gz);
        
    }
    
    //Clasee de atualização
    public static class mostrarPosicaoOlhinho implements IGazeListener{
   
        
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
            
                        
            System.out.println(ponto + "\t" + fixo + "\t" + tempo + "\n"); //Mostrar ponto
                        
//            escrever = new BufferedWriter(fw);

            resultado.println(ponto.x + "\t" + ponto.y + "\t" + fixo + "\t" + tempo);
            resultado.flush();

            
        }
        
    }
}
