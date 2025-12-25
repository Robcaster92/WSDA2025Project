package org.example.progettofinalerobertocastro;

import org.example.progettofinalerobertocastro.entity.*;
import org.example.progettofinalerobertocastro.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.Arrays;

@SpringBootApplication
public class ProgettoFinaleRobertoCastroApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProgettoFinaleRobertoCastroApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(UtenteRepository utenteRepo,
                                   DistributoreRepository distRepo,
                                   BevandaRepository bevandaRepo,
                                   ScortaBevandaRepository scortaRepo,
                                   GuastoRepository guastoRepo) {
        return args -> {
            // 1. UTENTI
            if (!utenteRepo.existsByUsername("admin")) {
                Utente admin = new Utente();
                admin.setUsername("admin");
                admin.setPassword("admin");
                admin.setRuolo("GESTORE");
                admin.setNome("Super");
                admin.setCognome("Admin");
                utenteRepo.save(admin);
                System.out.println("✅ Utente admin creato");
            }

            if (!utenteRepo.existsByUsername("mario")) {
                Utente mario = new Utente();
                mario.setUsername("mario");
                mario.setPassword("1234");
                mario.setRuolo("MANUTENTORE");
                mario.setNome("Mario");
                mario.setCognome("Rossi");
                utenteRepo.save(mario);
                System.out.println("✅ Utente mario creato");
            }

            // 2. BEVANDE (Se non esistono)
            if (bevandaRepo.count() == 0) {
                Bevanda caffe = new Bevanda(); caffe.setNome("Caffè"); caffe.setPrezzo(0.50);
                Bevanda the = new Bevanda(); the.setNome("Tè"); the.setPrezzo(0.40);
                Bevanda ciocco = new Bevanda(); ciocco.setNome("Cioccolata"); ciocco.setPrezzo(0.60);
                Bevanda cappuccino = new Bevanda(); cappuccino.setNome("Cappuccino"); cappuccino.setPrezzo(0.80);
                Bevanda latte = new Bevanda(); latte.setNome("Caffellatte"); latte.setPrezzo(0.70);
                bevandaRepo.saveAll(Arrays.asList(caffe, the, ciocco, cappuccino, latte));
            }

            // Recuperiamo le bevande dal DB per usarle
            Bevanda caffe = bevandaRepo.findAll().stream().filter(b -> b.getNome().equals("Caffè")).findFirst().orElse(null);
            Bevanda the = bevandaRepo.findAll().stream().filter(b -> b.getNome().equals("Tè")).findFirst().orElse(null);

            // 3. DISTRIBUTORI
            if (!distRepo.existsById(1001L)) {
                Distributore d1 = new Distributore();
                d1.setId(1001L);
                d1.setModello("Necta Solista");
                d1.setPosizione("Hall Principale");
                d1.setStato("Online");
                d1.setNomeManutentore("mario");
                d1.setUltimaManutenzione(LocalDate.now());
                distRepo.save(d1);

                // Scorte per d1
                creaScorta(scortaRepo, d1, caffe, 100, 100);
                creaScorta(scortaRepo, d1, the, 20, 100);

                System.out.println("✅ Distributore 1001 creato");
            }

            if (!distRepo.existsById(1002L)) {
                Distributore d2 = new Distributore();
                d2.setId(1002L);
                d2.setModello("Necta Opera");
                d2.setPosizione("Ufficio 2");
                d2.setStato("Offline");
                d2.setNomeManutentore("Non Assegnato");
                distRepo.save(d2);

                // Guasto per d2
                Guasto g = new Guasto();
                g.setDistributore(d2);
                g.setMessaggio("Mancanza bicchieri");
                g.setDataSegnalazione(LocalDateTime.now()); // Ora usa LocalDate.now() che è compatibile con LocalDateTime se JPA lo converte, altrimenti usa LocalDateTime.now()
                // FIX RAPIDO: Meglio usare LocalDateTime.now() visto che l'entità Guasto usa LocalDateTime
                g.setDataSegnalazione(java.time.LocalDateTime.now());
                guastoRepo.save(g);

                System.out.println("✅ Distributore 1002 creato (con guasto)");
            }
        };
    }

    private void creaScorta(ScortaBevandaRepository repo, Distributore d, Bevanda b, int q, int max) {
        if(b == null) return;
        ScortaBevanda s = new ScortaBevanda();
        s.setDistributore(d);
        s.setBevanda(b);
        s.setQuantita(q);
        s.setMaxQuantita(max);
        repo.save(s);
    }
}