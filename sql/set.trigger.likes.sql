DELIMITER //

CREATE TRIGGER update_item_insert
AFTER INSERT ON user_data
FOR EACH ROW
BEGIN
    IF NEW.liked = '1' THEN
        UPDATE item SET item.likes = item.likes+1 WHERE NEW.id = item.id;
    END IF;
    IF NEW.watchlist = '1' THEN
        UPDATE item SET item.marked = item.marked+1 WHERE NEW.id = item.id;
    END IF;
    IF NEW.watched = '1' THEN
        UPDATE item SET item.watched = item.watched+1 WHERE NEW.id = item.id;
    END IF;
END;

//

CREATE TRIGGER update_item_delete
AFTER DELETE ON user_data
FOR EACH ROW
BEGIN
    IF OLD.liked = '1' THEN
        UPDATE item SET item.likes = item.likes-1 WHERE OLD.id = item.id;
    END IF;
    IF OLD.watchlist = '1' THEN
        UPDATE item SET item.marked = item.marked-1 WHERE OLD.id = item.id;
    END IF;
    IF OLD.watched = '1' THEN
        UPDATE item SET item.watched = item.watched-1 WHERE OLD.id = item.id;
    END IF;
END;

//

CREATE TRIGGER update_item_update
AFTER UPDATE ON user_data
FOR EACH ROW
BEGIN
    IF NEW.liked != OLD.liked THEN
        IF NEW.liked = '1' THEN
            UPDATE item SET item.likes = item.likes+1 WHERE OLD.id = item.id;
        ELSE
            UPDATE item SET item.likes = item.likes-1 WHERE OLD.id = item.id;
        END IF;
    END IF;
    IF NEW.watched != OLD.watched THEN
        IF NEW.watched = '1' THEN
            UPDATE item SET item.watched = item.watched+1 WHERE OLD.id = item.id;
        ELSE
            UPDATE item SET item.watched = item.watched-1 WHERE OLD.id = item.id;
        END IF;
    END IF;
    IF NEW.watchlist != OLD.watchlist THEN
        IF NEW.watchlist = '1' THEN
            UPDATE item SET item.marked = item.marked+1 WHERE OLD.id = item.id;
        ELSE
            UPDATE item SET item.marked = item.marked-1 WHERE OLD.id = item.id;
        END IF;
    END IF;
END;

//

DELIMITER ;