DELIMITER //

CREATE TRIGGER update_item_insert
AFTER INSERT ON user_data
FOR EACH ROW
BEGIN
    IF NEW.liked IS NOT NULL THEN
        UPDATE item SET item.likes = item.likes+1 WHERE NEW.id = item.id;
    END IF;
    IF NEW.watchlist IS NOT NULL THEN
        UPDATE item SET item.marked = item.marked+1 WHERE NEW.id = item.id;
    END IF;
    IF NEW.watched IS NOT NULL THEN
        UPDATE item SET item.watched = item.watched+1 WHERE NEW.id = item.id;
    END IF;
END;

//

CREATE TRIGGER update_item_delete
AFTER DELETE ON user_data
FOR EACH ROW
BEGIN
    IF OLD.liked IS NOT NULL THEN
        UPDATE item SET item.likes = item.likes-1 WHERE OLD.id = item.id;
    END IF;
    IF OLD.watchlist IS NOT NULL THEN
        UPDATE item SET item.marked = item.marked-1 WHERE OLD.id = item.id;
    END IF;
    IF OLD.watched IS NOT NULL THEN
        UPDATE item SET item.watched = item.watched-1 WHERE OLD.id = item.id;
    END IF;
END;

//

CREATE TRIGGER update_item_update
AFTER UPDATE ON user_data
FOR EACH ROW
BEGIN
    IF (NEW.liked IS NULL AND OLD.liked IS NOT NULL) OR (NEW.liked IS NOT NULL AND OLD.liked IS NULL) THEN
        IF NEW.liked IS NOT NULL THEN
            UPDATE item SET item.likes = item.likes+1 WHERE OLD.id = item.id;
        ELSE
            UPDATE item SET item.likes = item.likes-1 WHERE OLD.id = item.id;
        END IF;
    END IF;
    IF (NEW.watched IS NULL AND OLD.watched IS NOT NULL) OR (NEW.watched IS NOT NULL AND OLD.watched IS NULL) THEN
        IF NEW.watched IS NOT NULL THEN
            UPDATE item SET item.watched = item.watched+1 WHERE OLD.id = item.id;
        ELSE
            UPDATE item SET item.watched = item.watched-1 WHERE OLD.id = item.id;
        END IF;
    END IF;
    IF (NEW.watchlist IS NULL AND OLD.watchlist IS NOT NULL) OR (NEW.watchlist IS NOT NULL AND OLD.watchlist IS NULL) THEN
        IF NEW.watchlist IS NOT NULL THEN
            UPDATE item SET item.marked = item.marked+1 WHERE OLD.id = item.id;
        ELSE
            UPDATE item SET item.marked = item.marked-1 WHERE OLD.id = item.id;
        END IF;
    END IF;
END;

//

DELIMITER ;