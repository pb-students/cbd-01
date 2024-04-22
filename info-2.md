> 1. Zaimplementować formularz logowania użytkowników.

<!-- TODO: Screen formularza  -->

> 2. Udostępnić użytkownikowi możliwość włączenia blokowania konta po n nieudanych
próbach logowania.

<!-- NOTE: Ustawilem na 99999, @Filip, dodaj widok do ustawienia. 99999 niech bedzie jako 'nieograniczone'  -->


> Jakie niesie za sobą zagrożenia takie rozwiązanie?

Użytkownik moze sie zablokowac na amen

> Jak powinna wyglądać procedura odblokowania konta? Czy wykorzystanie sekretnego pytania oraz odpowiedzi jest dobrym rozwiązaniem?

To zalezy od rodzaju serwisu. W wiekszosci stron wystarczy zwykly mail, w innych przypadkach nalezy zglosic to do odpowiedniego dzialu. Mozna tez wykorzystywac inne zaufane kanaly.


> 3. Zaimplementować logowanie zdarzeń takich jak:
> (a) data ostatniego nieudanego logowania,
> (b) data ostatniego udanego logowania,
> (c) liczba nieudanych logowań od ostatniego poprawnego logowania.

Tabela `login_attempts` sluzy do logowania wszystkich tych zdarzen
```sql
CREATE TABLE `login_attempts` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`username` text NOT NULL,
	`failed` integer DEFAULT false NOT NULL,
	`failed_attempts` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
```

> 4. Dane z powyższych punktów udostępnić użytkownikowi.
<!-- TODO: @Filip, widok i screeny tutaj. Wszystko masz pod /api/auth/login-attempts  -->

> 5. Zaimplementować opóźnienie po nieudanym logowaniu wyliczane w zależności od liczby nieudanych prób logowania (nie używać komendy sleep).

Z racji na to, ze nasz serwer jest asynchroniczny, mozemy opoznic to zapytanie bez obaw o to, ze inne zapytania rowniez zostana opoznione. Aby atakujacy nie wiedzial ile jest prob logowania, opoznienie uwzglednia dodana maksymalna ilosc nieudanych logowan jaka jest mozliwa. Aby bardziej zabezpieczyc ten proces, mozna dodac jeszcze losowy szum.

Bazowanie opoznienia na ilosci nieudanych prob zdradza atakujacemu informacje o ilosci nieudanych prob na konto. Lepszym rozwiazaniem byloby opoznienie bazowane na ilosci nieudanych prob z konkretnego adresu IP.

```ts
        // Jezeli istniala proba logowania i zakonczyla sie ona niepowodzeniem
        if (loginAttempt?.failed) {
          // Opoznienie = min(nieudane logowania z rzedu, max ustawiony przez uzytkownika) * 5000ms
          const timeoutMs = Math.min(loginAttempt.failedAttempts, maxFailedAttempts) * DELAY_BASE_MS

          console.warn(`Artificaial login delay for user '${data.username}': ${timeoutMs}ms`)

          // Oczekujemy na to az event loop wykona setTimeout po naszym opoznieniu
          await new Promise(resolve => setTimeout(resolve, timeoutMs))
        }
```

> 6. Jakie informacje są udostępniane użytkownikowi przy nieudanej próbie logowania? System nie powinien udostępniać informacji umożliwiających (pomagających) dokonanie włamania do projektowanego systemu.

Bledny login lub haslo:
  - Gdy nie ma uzytkownika w systemie
  - Gdy haslo jest niepoprawne

Konto zablokowane:
  - Gdy przekroczono limit niepoprawnych logowan

<!-- NOTE: Otworzylem PR w nuxt-authjs: https://github.com/Hebilicious/authjs-nuxt/pull/177 -->


> 7. Należy przechowywać informacje o próbie logowania do systemu użytkowników nieistniejących. Jaki ma to związek z powyższym punktem?

Tabela `login_attempts` zawiera pole `username`, ktore jest ustawiane przy kazdej probie logowania. Pole `user_id` jest ustawiane w przypadku, gdy dany uzytkownik istnieje. Jezeli po rejestracji nowego uzytkownika istnieja wpisy logowania na jego konto, usuwamy je. W przeciwnym razie nalezaloby oznaczyc poprzednie proby logowania jako niewidoczne dla uzytkownika i nie uwzgledniac ich podczas proby logowania.



> 8. Jak rozumiesz politykę haseł?

silne, nieslownikowe, losowe hasla najlepiej ze znakami wykraczajacymi poza zakres standardowego, 26 znakowego alfabetu
