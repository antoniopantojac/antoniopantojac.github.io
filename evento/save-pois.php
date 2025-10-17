<?php
// ==========================================
// API para Guardar POIs - Mapa de Puerres
// ==========================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Archivo donde se guardarán los POIs
$poisFile = 'pois-data.json';

// Función para leer POIs
function readPOIs() {
    global $poisFile;
    
    if (!file_exists($poisFile)) {
        return [];
    }
    
    $content = file_get_contents($poisFile);
    if ($content === false) {
        return [];
    }
    
    $data = json_decode($content, true);
    return $data ?: [];
}

// Función para guardar POIs
function savePOIs($pois) {
    global $poisFile;
    
    $json = json_encode($pois, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    if (file_put_contents($poisFile, $json) === false) {
        return false;
    }
    
    return true;
}

// Función para validar POI
function validatePOI($poi) {
    $required = ['id', 'name', 'coords'];
    
    foreach ($required as $field) {
        if (!isset($poi[$field]) || empty($poi[$field])) {
            return false;
        }
    }
    
    // Validar coordenadas
    if (!is_array($poi['coords']) || count($poi['coords']) !== 2) {
        return false;
    }
    
    $lat = floatval($poi['coords'][0]);
    $lng = floatval($poi['coords'][1]);
    
    if ($lat < -90 || $lat > 90 || $lng < -180 || $lng > 180) {
        return false;
    }
    
    return true;
}

// Función para generar respuesta
function sendResponse($success, $message, $data = null) {
    $response = [
        'success' => $success,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit();
}

// Función para generar ID único
function generateId() {
    return 'poi_' . time() . '_' . substr(md5(uniqid()), 0, 8);
}

// ==========================================
// Manejar diferentes métodos HTTP
// ==========================================

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Obtener todos los POIs
            $pois = readPOIs();
            sendResponse(true, 'POIs obtenidos exitosamente', $pois);
            break;
            
        case 'POST':
            // Crear nuevo POI
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                sendResponse(false, 'Datos JSON inválidos');
            }
            
            if (!validatePOI($input)) {
                sendResponse(false, 'Datos del POI inválidos');
            }
            
            // Generar ID si no existe
            if (empty($input['id'])) {
                $input['id'] = generateId();
            }
            
            // Agregar timestamp
            $input['created_at'] = date('Y-m-d H:i:s');
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            $pois = readPOIs();
            
            // Verificar si el ID ya existe
            $existingIndex = array_search($input['id'], array_column($pois, 'id'));
            if ($existingIndex !== false) {
                sendResponse(false, 'El POI con este ID ya existe');
            }
            
            $pois[] = $input;
            
            if (savePOIs($pois)) {
                sendResponse(true, 'POI creado exitosamente', $input);
            } else {
                sendResponse(false, 'Error al guardar el POI');
            }
            break;
            
        case 'PUT':
            // Actualizar POI existente
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || empty($input['id'])) {
                sendResponse(false, 'ID del POI requerido');
            }
            
            if (!validatePOI($input)) {
                sendResponse(false, 'Datos del POI inválidos');
            }
            
            $pois = readPOIs();
            $poiIndex = array_search($input['id'], array_column($pois, 'id'));
            
            if ($poiIndex === false) {
                sendResponse(false, 'POI no encontrado');
            }
            
            // Mantener created_at original
            if (isset($pois[$poiIndex]['created_at'])) {
                $input['created_at'] = $pois[$poiIndex]['created_at'];
            } else {
                $input['created_at'] = date('Y-m-d H:i:s');
            }
            
            $input['updated_at'] = date('Y-m-d H:i:s');
            $pois[$poiIndex] = $input;
            
            if (savePOIs($pois)) {
                sendResponse(true, 'POI actualizado exitosamente', $input);
            } else {
                sendResponse(false, 'Error al actualizar el POI');
            }
            break;
            
        case 'DELETE':
            // Eliminar POI
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || empty($input['id'])) {
                sendResponse(false, 'ID del POI requerido');
            }
            
            $pois = readPOIs();
            $poiIndex = array_search($input['id'], array_column($pois, 'id'));
            
            if ($poiIndex === false) {
                sendResponse(false, 'POI no encontrado');
            }
            
            $deletedPOI = $pois[$poiIndex];
            unset($pois[$poiIndex]);
            $pois = array_values($pois); // Reindexar array
            
            if (savePOIs($pois)) {
                sendResponse(true, 'POI eliminado exitosamente', $deletedPOI);
            } else {
                sendResponse(false, 'Error al eliminar el POI');
            }
            break;
            
        default:
            sendResponse(false, 'Método HTTP no soportado');
    }
    
} catch (Exception $e) {
    sendResponse(false, 'Error interno del servidor: ' . $e->getMessage());
}
?>
