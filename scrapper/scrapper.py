from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from contextlib import contextmanager
from datetime import datetime
import json
import mysql.connector

### Scrapper ###
# Ici nous allons récupérer les données pour notre future api directement sur le site 365chess.com
# Les données sont enregistrés dans une base qui sera ensuite dumpée et utilisée directement dans l'api


# permet la connexion avec la base de données notamment avec un with
@contextmanager
def get_db():
    conn = mysql.connector.connect(
        host="localhost",
        port=3306,
        user="admin",
        password="admin",
        database="chess_api"
    )
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def inserer_pays(pays):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.executemany("""
            INSERT IGNORE INTO pays (nom, code)
            VALUES (%s, %s)
        """, (pays))
        print(f"{cursor.rowcount} pays inséré(s)")

def inserer_joueurs(joueurs):
    """joueurs : liste de tuples (nom_complet, code_pays)"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.executemany("""
            INSERT IGNORE INTO joueur (nom_complet, code_pays)
            VALUES (%s, %s)
        """, joueurs)
        print(f"{cursor.rowcount} joueur(s) inséré(s) en base")

def inserer_tournois(tournois):
    """tournois : liste de tuples (nom, date, classement_moyen, nbr_joueurs, nbr_parties, code_pays)"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.executemany("""
            INSERT IGNORE INTO tournoi (nom, date, classement_moyen, nbr_joueurs, nbr_parties, code_pays)
            VALUES (%s, %s,%s, %s,%s, %s)
        """, tournois)
        print(f"{cursor.rowcount} tournoi(s) inséré(s) en base")

def inserer_ouvertures(ouvertures):
    """ouvertures : liste de tuples (code_eco, libelle)"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.executemany("""
            INSERT IGNORE INTO ouverture (code_eco, libelle)
            VALUES (%s, %s)
        """, ouvertures)
        print(f"{cursor.rowcount} ouverture(s) inséré(s) en base")

def inserer_participations(participations):
    """participations : liste de tuples (nom_complet, id_tournoi, elo, points_marques)"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.executemany("""
            INSERT IGNORE INTO participation (nom_complet, id_tournoi, elo, points_marques)
            VALUES (%s, %s, %s, %s)
        """, participations)
        print(f"{cursor.rowcount} participation(s) inséré(s) en base")

def inserer_parties(parties):
    """parties : liste de tuples (nom_complet_blancs, nom_complet_noirs, resultat, id_ouverture, id_tournoi, date_partie, ronde, numero_table)"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.executemany("""
            INSERT IGNORE INTO partie (nom_complet_blancs, nom_complet_noirs, resultat, id_ouverture, id_tournoi, date_partie, ronde, numero_table)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, parties)
        print(f"{cursor.rowcount} partie(s) inséré(s) en base")

def get_id_tournoi(cursor, nom,date):
    cursor.execute("""
        SELECT id FROM tournoi WHERE nom = %s AND date = %s
    """, (nom,date))
    
    result = cursor.fetchone()
    return result[0] if result else None

def get_id_ouverture(cursor, code_eco,libelle):
    cursor.execute("""
        SELECT id FROM ouverture WHERE code_eco = %s AND libelle = %s
    """, (code_eco,libelle))
    
    result = cursor.fetchone()
    return result[0] if result else None


with open("tournaments.json", "r", encoding="utf-8") as f:
    tournaments = json.load(f)


for tournament in tournaments[106:]:
    with sync_playwright() as p:
        with get_db() as conn:
            cursor = conn.cursor()
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36"
            )

            page = context.new_page()
            page.goto(tournament, wait_until="domcontentloaded", timeout=60000)

            # Si la table des joueurs contient un lien "Show full players list", on clique dessus
            try:
                show_full_link = page.locator("#full_players a", has_text="Show full players list")
                if show_full_link.count() > 0:
                    show_full_link.click()
                    page.wait_for_load_state("networkidle", timeout=10000)
            except:
                pass

            html = page.content()


            soup = BeautifulSoup(html, "html.parser")
            # ON A LA PAGE A PARTIR D'ICI

            # tableau de correspondance code_pays -> nom_pays
            with open("pays.json", "r", encoding="utf-8") as f:
                pays = json.load(f)

            ##### Ajout tournoi #########################################################################

            print('\n----- TOURNOI -----\n')
            # nom du tournoi
            nom_tournoi = soup.select_one("h1").text
            print("nom tournoi : ",nom_tournoi)

            # récupération des 4 valeurs td avec les infos du tournoi
            tableau_infos_tournoi = soup.select("table.table.ttable tbody td")

            #date du tournoi
            date_tournoi = tableau_infos_tournoi[0].text
            date_tournoi = datetime.strptime(date_tournoi, "%b %d, %Y").strftime("%Y-%m-%d")
            print("date du tournoi : ",date_tournoi)

            #nombre de joueurs
            nb_joueurs = tableau_infos_tournoi[1].text
            print("nombre de joueurs : ",nb_joueurs)

            # elo moyen
            elo_moyen = tableau_infos_tournoi[2].text
            print("Elo moyen : ",elo_moyen)

            # nombre de parties
            nb_parties = tableau_infos_tournoi[3].text
            print("Parties jouées : ",nb_parties)

            # ville / pays / année du tournoi
            img = soup.select_one("div#mainfull img")
            code_pays_tournoi = img['src'].split("/")[-1].split(".")[0]
            nom_pays_tournoi = pays[code_pays_tournoi]
            texte = img.next_sibling  # nœud texte juste après l'image
            print()
            #### Ajout du pays ####
            print("Ajout du pays : ",code_pays_tournoi, nom_pays_tournoi )
            inserer_pays([(nom_pays_tournoi,code_pays_tournoi)])

            print("Ajout du tournoi")
            inserer_tournois([(nom_tournoi, date_tournoi, elo_moyen, nb_joueurs, nb_parties,code_pays_tournoi)])
            print()

            #### Fin Ajout Tournoi ####################################################################################


            ##### Ajout joueurs #######################################################################################

            print('---- JOUEURS -----\n')
            players = soup.select("#full_players a[href^='/players/']")
            countries = soup.select("#full_players img")

            joueurs_a_inserer = []
            pays_a_inserer = []
            for i in range(len(players)):
                lien = players[i]
                img = countries[i]
                code_pays_joueur = img['src'].split("/")[-1].split(".")[0]
                code_pays_joueur = code_pays_joueur.lower()
                pays_a_inserer.append((pays[code_pays_joueur],code_pays_joueur))
                nom_complet = lien['href'].split("/")[-1].split("_")
                nom_complet = [nom_complet[0], " ".join(nom_complet[1:])]
                nom_complet = " ".join(nom_complet)
                joueurs_a_inserer.append((nom_complet, code_pays_joueur))
                print(f"Joueur : {nom_complet}")
                print(f"Pays : {pays[code_pays_joueur]}\n")

            if pays_a_inserer : 
                inserer_pays(pays_a_inserer)
            if joueurs_a_inserer:
                inserer_joueurs(joueurs_a_inserer)
            else:
                print("Aucun joueur trouvé.")

            print(f"\n{len(joueurs_a_inserer)} joueur(s) traités.\n")
            print()

            ##### Fin ajout des joueurs ################################################################

            ##### Ajout ouvertures ################################################################
            print("------ OUVERTURES ------\n")
            ouvertures = soup.select("#col-open")
            ouvertures_a_ajouter = []
            for i in range(1,len(ouvertures)):
                ouverture = ouvertures[i]
                libelle_ouverture = ouverture.find(text = True, recursive=False)
                code_ouverture = ouverture.find("a").string

                ouvertures_a_ajouter.append((code_ouverture,libelle_ouverture))
                print("code ouverture : ",code_ouverture)
                print("libelle ouverture : ",libelle_ouverture)
                print()

            inserer_ouvertures(ouvertures_a_ajouter)
            print()
            


            #### Ajout Parties ##########################################################################

            # Recherche résultats

            a_resultats = soup.select("a[href^='/game.php?gid']")
            print(a_resultats[0].text)

            # petit divtionnaire pour formater correctement le scrap
            corresp = {"0-1 " : -1 , "1-0 " : 1 , "½-½ " : 0}

            # dates parties
            dates_parties = soup.select("#col-dat")

            # Ronde et table
            ronde_table = soup.select("td:has(+ #col-dat)")

            parties = soup.select("table.table.stable tr a[href^='/players/']:not(#full_players *)")
            parties_a_ajouter = []
            id_tournoi = get_id_tournoi(cursor, nom_tournoi, date_tournoi)
            
            for i in range(0,len(parties),2):
                tmp = []
                blanc = parties[i]['href'].split("/")[-1].split("_")
                noir = parties[i+1]['href'].split("/")[-1].split("_")
            
                blanc = [blanc[0], " ".join(blanc[1:])]
                noir = [noir[0], " ".join(noir[1:])]

                blanc = " ".join(blanc)
                noir = " ".join(noir)

                id_ouverture = get_id_ouverture(cursor,ouvertures_a_ajouter[i//2][0],ouvertures_a_ajouter[i//2][1])
                resultat = corresp[a_resultats[i//2].text]
                date_partie = dates_parties[(i//2)+1].text
                date_partie = datetime.strptime(date_partie, "%b %d, %Y").strftime("%Y-%m-%d")
                ronde = int(ronde_table[(i//2)+1].text.split(".")[0])
                table = int(ronde_table[(i//2)+1].text.split(".")[1])

                tmp.append(blanc)
                tmp.append(noir)
                tmp.append(resultat)
                tmp.append(id_ouverture)
                tmp.append(id_tournoi)
                tmp.append(date_partie)
                tmp.append(ronde)
                tmp.append(table)

                print(tmp)
                print('Partie ',(i//2)+1," - blancs : ",blanc)
                print('Partie ',(i//2)+1," - noirs : ",noir)
                print()

                parties_a_ajouter.append(tuple(tmp))

            inserer_parties(parties_a_ajouter)

            #### Fin ajout partie ###########################################################

            #### Ajout Participation ########################################################

            # recherche elos
            elos = soup.select("td:has(a[href^='/players/']) + td")
            # recherche résultats
            resultats = soup.select("td:has(a[href^='/players/']) + td + td")

            participations_a_ajouter = []

            for i in range(len(joueurs_a_inserer)):

                joueur = joueurs_a_inserer[i]
                tmp = []

                tmp.append(joueur[0])
                tmp.append(id_tournoi)
                tmp.append(elos[i].text)
                tmp.append(resultats[i].text)

                participations_a_ajouter.append(tmp)
                print(tmp)

            inserer_participations(participations_a_ajouter)


   