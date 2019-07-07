# Avant de lancer l'atelier

Transformer toutes les colonnes time (created_at, updated_at) pour qu'elles reçoivent 13 chiffres:

ALTER TABLE latable MODIFY colonne TYPE(LONG) NULL DEFAULT

ALTER TABLE latable MODIFY created_at INT(13);

## Code à jouer :

(en fait, il suffirait de l'injecter dans la base)

```

ALTER TABLE icare_hot.actualites MODIFY created_at VARCHAR(13);
ALTER TABLE icare_hot.actualites MODIFY updated_at VARCHAR(13);

```
